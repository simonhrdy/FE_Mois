import type { AnalyticsService } from '@/features/analytics/services/analytics.service';
import type { AnalyticsPeriod } from '@/features/analytics/types/stats.types';
import type { CompetitorService } from '@/features/competitors/services/competitor.service';
import type { InsightService } from '@/features/insights/services/insight.service';
import { TOPIC_PRESENTATION } from '@/features/insights/utils/topic-presentation';
import type { ComparisonRow } from '@/features/competitors/types/competitor.types';
import type { ReviewService } from '@/features/reviews/services/review.service';
import { lastDaysRange, lastMonthsRange } from '@/lib/utils/date';
import { formatNumber, formatRating, formatRatingDelta } from '@/lib/utils/format';

import type { AssistantResponse, AssistantResult, ToolCall } from '../types/assistant.types';

import { DEFAULT_TOPIC_DAYS, DEFAULT_TREND_MONTHS } from './assistant-planner';

const TOPICS_IN_ANSWER = 3;

interface Services {
  reviews: ReviewService;
  competitors: CompetitorService;
  analytics: AnalyticsService;
  insights: InsightService;
}

interface ExecutionState {
  competitorIds: string[];
  results: AssistantResult[];
  sentences: string[];
}

const HELP_ANSWER =
  'Umím vyhledat negativní recenze, zjistit, co zákazníkům vadí, porovnat vás s nejlépe ' +
  'hodnocenou konkurencí a ukázat vývoj hodnocení. Zkuste například: „Ukaž mi negativní ' +
  'recenze a porovnej mě se třemi nejlepšími pizzeriemi v okolí.“';

const numberArg = (call: ToolCall, key: string, fallback: number): number => {
  const value = call.arguments[key];
  return typeof value === 'number' ? value : fallback;
};

const PERIOD_MONTHS: readonly AnalyticsPeriod[] = [3, 6, 12, 24];
const toPeriod = (months: number): AnalyticsPeriod =>
  PERIOD_MONTHS.find((period) => period >= months) ?? DEFAULT_TREND_MONTHS;

function describeComparison(rows: readonly ComparisonRow[]): string {
  const own = rows.find((row) => row.isOwn);
  const others = rows.filter((row) => !row.isOwn);
  const othersAverage =
    others.reduce((sum, row) => sum + (row.stats.averageRating ?? 0), 0) / (others.length || 1);
  const names = others
    .map((row) => `${row.business.name} (${formatRating(row.stats.averageRating)})`)
    .join(', ');
  const ownRating = own?.stats.averageRating ?? null;
  const delta = ownRating === null || others.length === 0 ? null : ownRating - othersAverage;
  return (
    `Za posledních 12 měsíců máte hodnocení ${formatRating(ownRating)}. ` +
    `Porovnání: ${names}. Oproti jejich průměru jste ${formatRatingDelta(delta)} hvězdy.`
  );
}

export function createAssistantExecutor({ reviews, competitors, analytics, insights }: Services) {
  const tools: Record<
    ToolCall['name'],
    (
      call: ToolCall,
      businessId: string,
      state: ExecutionState,
      signal?: AbortSignal,
    ) => Promise<void>
  > = {
    async search_reviews(call, businessId, state, signal) {
      const days = call.arguments.periodDays;
      const range = typeof days === 'number' ? lastDaysRange(days) : undefined;
      const page = await reviews.getNegativeReviews(
        businessId,
        { limit: numberArg(call, 'limit', 5), ...range },
        signal,
      );
      state.results.push({
        type: 'reviews',
        title: 'Negativní recenze (1–2 ★)',
        total: page.meta.totalItems,
        reviews: page.data,
      });
      state.sentences.push(
        `Našel jsem ${formatNumber(page.meta.totalItems)} negativních recenzí` +
          `${range ? ` za posledních ${days} dní` : ''}; zobrazuji ${page.data.length} nejnovějších.`,
      );
    },

    async find_competitors(call, businessId, state, signal) {
      const top = await competitors.getTopRated(businessId, numberArg(call, 'limit', 3), signal);
      state.competitorIds = top.map((business) => business.id);
    },

    async compare_businesses(call, businessId, state, signal) {
      const rows = await competitors.compare(
        businessId,
        state.competitorIds,
        toPeriod(numberArg(call, 'months', DEFAULT_TREND_MONTHS)),
        signal,
      );
      state.results.push({
        type: 'comparison',
        title: 'Porovnání s konkurencí (12 měsíců)',
        rows: rows.map((row) => ({
          businessId: row.business.id,
          name: row.business.name,
          averageRating: row.stats.averageRating,
          reviewCount: row.stats.reviewCount,
          negativeShare: row.negativeShare,
          isOwn: row.isOwn,
        })),
      });
      state.sentences.push(describeComparison(rows));
    },

    async analyze_topics(call, businessId, state, signal) {
      const days = numberArg(call, 'periodDays', DEFAULT_TOPIC_DAYS);
      const topics = (await insights.getTopics(businessId, lastDaysRange(days), signal)).filter(
        (topic) => topic.count > 0,
      );
      state.results.push({ type: 'topics', title: `Témata stížností (${days} dní)`, topics });
      const top = topics
        .slice(0, TOPICS_IN_ANSWER)
        .map((topic) => `${TOPIC_PRESENTATION[topic.topic].label.toLowerCase()} (${topic.count}×)`);
      state.sentences.push(
        top.length > 0
          ? `Za posledních ${days} dní zákazníkům nejvíc vadí: ${top.join(', ')}.`
          : `Za posledních ${days} dní nejsou žádné stížnosti.`,
      );
    },

    async get_rating_trend(call, businessId, state, signal) {
      const months = numberArg(call, 'months', DEFAULT_TREND_MONTHS);
      const stats = await analytics.getStats(businessId, lastMonthsRange(months), signal);
      state.results.push({
        type: 'trend',
        title: `Vývoj hodnocení (${months} měsíců)`,
        points: stats.monthly,
      });
      state.sentences.push(
        `Průměrné hodnocení za ${months} měsíců je ${formatRating(stats.averageRating)} ` +
          `z ${formatNumber(stats.reviewCount)} recenzí.`,
      );
    },
  };

  return async function execute(
    plan: readonly ToolCall[],
    businessId: string,
    signal?: AbortSignal,
  ): Promise<AssistantResponse> {
    if (plan.length === 0) return { answer: HELP_ANSWER, toolCalls: [], results: [] };

    const state: ExecutionState = { competitorIds: [], results: [], sentences: [] };
    for (const call of plan) {
      await tools[call.name](call, businessId, state, signal);
    }
    return { answer: state.sentences.join(' '), toolCalls: [...plan], results: state.results };
  };
}
