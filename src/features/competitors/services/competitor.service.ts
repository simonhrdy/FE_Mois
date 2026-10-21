import { statsRepository, type StatsRepository } from '@/features/analytics/repositories';
import type { AnalyticsPeriod } from '@/features/analytics/types/stats.types';
import {
  negativeShare,
  ratingDifference,
  trendDirection,
} from '@/features/analytics/utils/rating-math';
import { businessRepository, type BusinessRepository } from '@/features/businesses/repositories';
import type { Business } from '@/features/businesses/types/business.types';
import { lastMonthsRange } from '@/lib/utils/date';

import { competitorRepository, type CompetitorRepository } from '../repositories';
import type { ComparisonRow, Competitor, CompetitorQuery } from '../types/competitor.types';

const DEFAULT_QUERY: CompetitorQuery = { search: '', sort: 'rating' };

interface Dependencies {
  competitors: CompetitorRepository;
  businesses: BusinessRepository;
  stats: StatsRepository;
  now?: () => Date;
}

export function createCompetitorService({
  competitors,
  businesses,
  stats,
  now = () => new Date(),
}: Dependencies) {
  async function compare(
    businessId: string,
    competitorIds: readonly string[],
    months: AnalyticsPeriod,
    signal?: AbortSignal,
  ): Promise<ComparisonRow[]> {
    const range = lastMonthsRange(months, now());
    const ids = [businessId, ...competitorIds.filter((id) => id !== businessId)];
    const entries = await Promise.all(
      ids.map(async (id) => {
        const [business, businessStats] = await Promise.all([
          businesses.getById(id, signal),
          stats.getStats(id, range, signal),
        ]);
        return { business, stats: businessStats };
      }),
    );
    const ownRating = entries[0]?.stats.averageRating ?? null;

    return entries
      .map(({ business, stats: businessStats }) => ({
        business,
        stats: businessStats,
        isOwn: business.id === businessId,
        ratingDelta:
          business.id === businessId ? 0 : ratingDifference(businessStats.averageRating, ownRating),
        negativeShare: negativeShare(businessStats),
        trend: trendDirection(businessStats.monthly),
      }))
      .sort((a, b) => (b.stats.averageRating ?? 0) - (a.stats.averageRating ?? 0));
  }

  return {
    compare,

    searchCompetitors(
      businessId: string,
      query: CompetitorQuery = DEFAULT_QUERY,
      signal?: AbortSignal,
    ): Promise<Competitor[]> {
      return competitors.search(businessId, query, signal);
    },

    async getTopRated(businessId: string, limit: number, signal?: AbortSignal) {
      const list = await competitors.search(businessId, DEFAULT_QUERY, signal);
      return list.slice(0, limit);
    },

    getWatchlist(businessId: string, signal?: AbortSignal): Promise<Business[]> {
      return competitors.getWatchlist(businessId, signal);
    },

    watch: (businessId: string, competitorId: string) =>
      competitors.watch(businessId, competitorId),
    unwatch: (businessId: string, competitorId: string) =>
      competitors.unwatch(businessId, competitorId),

    async compareWithWatchlist(businessId: string, months: AnalyticsPeriod, signal?: AbortSignal) {
      const watched = await competitors.getWatchlist(businessId, signal);
      return compare(
        businessId,
        watched.map((business) => business.id),
        months,
        signal,
      );
    },
  };
}

export type CompetitorService = ReturnType<typeof createCompetitorService>;

export const competitorService = createCompetitorService({
  competitors: competitorRepository,
  businesses: businessRepository,
  stats: statsRepository,
});
