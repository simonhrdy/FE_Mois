import { delay, type MockDatabase } from '@/mocks/mock-db';

import type { ReviewRepository } from './review.repository';

export function createMockReviewRepository(db: () => MockDatabase): ReviewRepository {
  return {
    async list(businessId, query, signal) {
      await delay(undefined, signal);
      return db().reviews(businessId, query);
    },
  };
}
