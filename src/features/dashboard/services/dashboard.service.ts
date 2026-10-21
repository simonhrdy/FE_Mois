import {
  analyticsService,
  type AnalyticsService,
} from '@/features/analytics/services/analytics.service';
import type { BusinessStats } from '@/features/analytics/types/stats.types';
import {
  directionOf,
  negativeShare,
  ratingDifference,
  trendDirection,
} from '@/features/analytics/utils/rating-math';
import { businessService } from '@/features/businesses/services/business.service';
import type { Business } from '@/features/businesses/types/business.types';
import {
  competitorService,
  type CompetitorService,
} from '@/features/competitors/services/competitor.service';
import type { Competitor, TrendDirection } from '@/features/competitors/types/competitor.types';
import { insightService, type InsightService } from '@/features/insights/services/insight.service';
import { buildSummary, type InsightSummary } from '@/features/insights/services/recommendations';
import { computeReputationScore } from '@/features/insights/services/reputation-score';
import type { ReputationScore, TopicInsight } from '@/features/insights/types/insight.types';
import { reviewService, type ReviewService } from '@/features/reviews/services/review.service';
import type { Review } from '@/features/reviews/types/review.types';
import { RECENT_PERIOD_DAYS } from '@/lib/config/app';
import { lastDaysRange, lastMonthsRange, previousRange } from '@/lib/utils/date';

const TREND_MONTHS = 12;
const TOP_COMPETITORS = 3;

export interface RankingEntry {
  id: string;
  name: string;
  stars: number;
  reviewCount: number;
  isOwn: boolean;
}

export interface CompetitionSummary {
  rank: number;
  total: number;
  averageRating: number | null;
  top: Competitor[];

  ranking: RankingEntry[];
}

export interface DashboardOverview {
  business: Business;
  recent: BusinessStats;
  previous: BusinessStats;

  recentRatingChange: number | null;
  recentDirection: TrendDirection;
  yearTrend: BusinessStats;
  trend: TrendDirection;
  latestReviews: Review[];
  competition: CompetitionSummary;
  topics: TopicInsight[];
  score: ReputationScore;
  summary: InsightSummary;
}

interface Dependencies {
  getBusiness: (id: string, signal?: AbortSignal) => Promise<Business>;
  analytics: AnalyticsService;
  reviews: ReviewService;
  competitors: CompetitorService;
  insights: InsightService;
  now?: () => Date;
}

export function summarizeCompetition(
  own: Business,
  competitors: readonly Competitor[],
): CompetitionSummary {
  const better = competitors.filter((competitor) => competitor.stars > own.stars).length;
  const ratings = competitors.map((competitor) => competitor.stars);
  const average =
    ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : null;
  const toEntry = (business: Business, isOwn: boolean): RankingEntry => ({
    id: business.id,
    name: business.name,
    stars: business.stars,
    reviewCount: business.reviewCount,
    isOwn,
  });
  return {
    rank: better + 1,
    total: competitors.length + 1,
    averageRating: average === null ? null : Math.round(average * 10) / 10,
    top: competitors.slice(0, TOP_COMPETITORS),
    ranking: [toEntry(own, true), ...competitors.map((item) => toEntry(item, false))].sort(
      (a, b) => b.stars - a.stars || Number(b.isOwn) - Number(a.isOwn),
    ),
  };
}

export function createDashboardService({
  getBusiness,
  analytics,
  reviews,
  competitors,
  insights,
  now = () => new Date(),
}: Dependencies) {
  return {
    async getOverview(businessId: string, signal?: AbortSignal): Promise<DashboardOverview> {
      const recentRange = lastDaysRange(RECENT_PERIOD_DAYS, now());
      const [business, recent, previous, yearTrend, latestReviews, competitorList, topics] =
        await Promise.all([
          getBusiness(businessId, signal),
          analytics.getStats(businessId, recentRange, signal),
          analytics.getStats(businessId, previousRange(recentRange), signal),
          analytics.getStats(businessId, lastMonthsRange(TREND_MONTHS, now()), signal),
          reviews.getLatestReviews(businessId, undefined, signal),
          competitors.searchCompetitors(businessId, undefined, signal),
          insights.getTopics(businessId, recentRange, signal),
        ]);
      const recentRatingChange = ratingDifference(recent.averageRating, previous.averageRating);
      const competition = summarizeCompetition(business, competitorList);
      const score = computeReputationScore({
        averageRating: recent.averageRating,
        negativeShare: negativeShare(recent),
        ratingChange: recentRatingChange,
        benchmarkDelta: ratingDifference(recent.averageRating, competition.averageRating),
      });

      return {
        business,
        recent,
        previous,
        recentRatingChange,
        recentDirection: directionOf(recentRatingChange),
        yearTrend,
        trend: trendDirection(yearTrend.monthly),
        latestReviews,
        competition,
        topics,
        score,
        summary: buildSummary({
          businessName: business.name,
          periodLabel: `posledních ${RECENT_PERIOD_DAYS} dní`,
          averageRating: recent.averageRating,
          ratingChange: recentRatingChange,
          reviewCount: recent.reviewCount,
          negativeCount: recent.negativeCount,
          score,
          topics,
        }),
      };
    },
  };
}

export const dashboardService = createDashboardService({
  getBusiness: businessService.getBusiness,
  analytics: analyticsService,
  reviews: reviewService,
  competitors: competitorService,
  insights: insightService,
});
