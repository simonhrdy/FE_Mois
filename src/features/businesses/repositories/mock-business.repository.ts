import { delay, type MockDatabase } from '@/mocks/mock-db';

import type { BusinessRepository } from './business.repository';

export function createMockBusinessRepository(db: () => MockDatabase): BusinessRepository {
  return {
    async getById(id, signal) {
      await delay(undefined, signal);
      return db().business(id);
    },
  };
}
