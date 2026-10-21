import {
  competitorRepository,
  type CompetitorRepository,
} from '@/features/competitors/repositories';
import type { TrendDirection } from '@/features/competitors/types/competitor.types';
import { lastMonthsRange, previousRange } from '@/lib/utils/date';

import { statsRepository, type StatsRepository } from '../repositories';
import type { AnalyticsPeriod, BusinessStats, DateRange, RatingPoint } from '../types/stats.types';
import {
  combineMonthly,
  negativeShare,
  ratingDifference,
  trendDirection,
  weightedAverage,
} from '../utils/rating-math';

export type BenchmarkSource = 'watchlist' | 'category';

export interface Benchmark {
  source: BenchmarkSource;
  businessCount: number;
  averageRating: number | null;
  monthly: RatingPoint[];
}

export interface AnalyticsReport {
  range: DateRange;
  current: BusinessStats;
  previous: BusinessStats;

  ratingChange: number | null;
  reviewCountChange: number;
  negativeShare: number;
  trend: TrendDirection;
  benchmark: Benchmark;

  benchmarkDelta: number | null;
}

interface Dependencies {
  stats: StatsRepository;
  competitors: CompetitorRepository;
  now?: () => Date;
}

export function createAnalyticsService({
  stats,
  competitors,
  now = () => new Date(),
}: Dependencies) {
  async function benchmarkIds(businessId: string, signal?: AbortSignal) {
    const watched = await competitors.getWatchlist(businessId, signal);
    if (watched.length > 0) {
      return { source: 'watchlist' as const, ids: watched.map((business) => business.id) };
    }
    const category = await competitors.search(businessId, { search: '', sort: 'rating' }, signal);
    return { source: 'category' as const, ids: category.map((business) => business.id) };
  }

  return {
    getStats(businessId: string, range: DateRange, signal?: AbortSignal) {
      return stats.getStats(businessId, range, signal);
    },

    async getReport(
      businessId: string,
      months: AnalyticsPeriod,
      signal?: AbortSignal,
    ): Promise<AnalyticsReport> {
      const range = lastMonthsRange(months, now());
      const [current, previous, benchmarkSet] = await Promise.all([
        stats.getStats(businessId, range, signal),
        stats.getStats(businessId, previousRange(range), signal),
        benchmarkIds(businessId, signal),
      ]);
      const benchmarkStats = await Promise.all(
        benchmarkSet.ids.map((id) => stats.getStats(id, range, signal)),
      );
      const benchmarkAverage = weightedAverage(benchmarkStats);

      return {
        range,
        current,
        previous,
        ratingChange: ratingDifference(current.averageRating, previous.averageRating),
        reviewCountChange: current.reviewCount - previous.reviewCount,
        negativeShare: negativeShare(current),
        trend: trendDirection(current.monthly),
        benchmark: {
          source: benchmarkSet.source,
          businessCount: benchmarkStats.length,
          averageRating: benchmarkAverage,
          monthly: combineMonthly(benchmarkStats),
        },
        benchmarkDelta: ratingDifference(current.averageRating, benchmarkAverage),
      };
    },
  };
}

export type AnalyticsService = ReturnType<typeof createAnalyticsService>;

export const analyticsService = createAnalyticsService({
  stats: statsRepository,
  competitors: competitorRepository,
});
