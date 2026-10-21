import { sessionStorageAdapter } from '@/lib/auth/session-storage';
import { delay, type MockDatabase } from '@/mocks/mock-db';

import type { AuthRepository } from './auth.repository';

export function createMockAuthRepository(db: () => MockDatabase): AuthRepository {
  return {
    async login({ email, password }) {
      await delay();
      return db().login(email, password);
    },
    async me(signal) {
      await delay(undefined, signal);
      return db().me(sessionStorageAdapter.getToken());
    },
  };
}
