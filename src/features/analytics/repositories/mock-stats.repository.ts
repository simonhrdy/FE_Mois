import { delay, type MockDatabase } from '@/mocks/mock-db';

import type { StatsRepository } from './stats.repository';

export function createMockStatsRepository(db: () => MockDatabase): StatsRepository {
  return {
    async getStats(businessId, range, signal) {
      await delay(undefined, signal);
      return db().stats(businessId, range);
    },
  };
}
