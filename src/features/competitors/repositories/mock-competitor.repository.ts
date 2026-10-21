import { delay, type MockDatabase } from '@/mocks/mock-db';

import type { CompetitorRepository } from './competitor.repository';

export function createMockCompetitorRepository(db: () => MockDatabase): CompetitorRepository {
  return {
    async search(businessId, query, signal) {
      await delay(undefined, signal);
      return db().competitors(businessId, query);
    },
    async getWatchlist(businessId, signal) {
      await delay(undefined, signal);
      return db().watchlist(businessId);
    },
    async watch(businessId, competitorId) {
      await delay();
      db().watch(businessId, competitorId);
    },
    async unwatch(businessId, competitorId) {
      await delay();
      db().unwatch(businessId, competitorId);
    },
  };
}
