import { delay, type MockDatabase } from '@/mocks/mock-db';

import type { InsightRepository } from './insight.repository';

export function createMockInsightRepository(db: () => MockDatabase): InsightRepository {
  return {
    async getTopics(businessId, range, signal) {
      await delay(undefined, signal);
      return db().topics(businessId, range);
    },
  };
}
