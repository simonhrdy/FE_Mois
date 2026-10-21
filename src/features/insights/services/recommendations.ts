import { formatNumber, formatRating, formatRatingDelta } from '@/lib/utils/format';

import type { ComplaintTopic, ReputationScore, TopicInsight } from '../types/insight.types';
import { TOPIC_PRESENTATION } from '../utils/topic-presentation';

const RECOMMENDATIONS: Record<ComplaintTopic, string> = {
  temperature: 'Zkontrolujte termoboxy a zkraťte čas mezi upečením a výdejem.',
  delivery: 'Prověřte rozvozovou službu a zpřesněte odhadované časy doručení.',
  waiting: 'Posilte obsluhu ve špičce a informujte hosty o čekací době.',
  staff: 'Naplánujte školení zákaznického přístupu pro obsluhu a pokladnu.',
  quality: 'Zkontrolujte receptury, dobu pečení a kvalitu surovin.',
  cleanliness: 'Zaveďte kontrolní seznam úklidu stolů a toalet během provozu.',
  price: 'Zvažte polední menu nebo zvýhodněné kombinace pro citlivé zákazníky.',
  management: 'Zákazníci vnímají změnu vedení negativně — komunikujte, co se zlepšuje.',
};

const MAX_RECOMMENDATIONS = 3;

export interface SummaryInput {
  businessName: string;
  periodLabel: string;
  averageRating: number | null;
  ratingChange: number | null;
  reviewCount: number;
  negativeCount: number;
  score: ReputationScore;
  topics: readonly TopicInsight[];
}

export interface InsightSummary {
  headline: string;
  sentences: string[];
  recommendations: string[];
}

export function buildSummary(input: SummaryInput): InsightSummary {
  const declining = (input.ratingChange ?? 0) <= -0.2;
  const improving = (input.ratingChange ?? 0) >= 0.2;
  const topTopics = input.topics.filter((topic) => topic.count > 0).slice(0, MAX_RECOMMENDATIONS);

  const headline = declining
    ? 'Reputace se zhoršuje — je čas jednat.'
    : improving
      ? 'Reputace se zlepšuje, pokračujte v nastaveném směru.'
      : 'Reputace je stabilní.';

  const sentences = [
    `Za ${input.periodLabel} přibylo ${formatNumber(input.reviewCount)} recenzí s průměrem ` +
      `${formatRating(input.averageRating)} ★ (${formatRatingDelta(input.ratingChange)} oproti předchozímu období).`,
  ];
  if (input.negativeCount > 0 && topTopics.length > 0) {
    const list = topTopics
      .map((topic) => `${TOPIC_PRESENTATION[topic.topic].label.toLowerCase()} (${topic.count}×)`)
      .join(', ');
    sentences.push(
      `Z ${formatNumber(input.negativeCount)} negativních recenzí si zákazníci nejčastěji stěžují na: ${list}.`,
    );
  }
  sentences.push(`Skóre reputace ${input.businessName} je ${input.score.score} ze 100.`);

  return {
    headline,
    sentences,
    recommendations: topTopics.map((topic) => RECOMMENDATIONS[topic.topic]),
  };
}
