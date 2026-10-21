import { isApiError } from '@/lib/api/errors';
import { sessionStorageAdapter } from '@/lib/auth/session-storage';

import { authRepository, type AuthRepository } from '../repositories';
import type { AuthUser, LoginInput } from '../types/auth.types';

export function createAuthService(repository: AuthRepository, storage = sessionStorageAdapter) {
  return {
    async login(input: LoginInput): Promise<AuthUser> {
      const session = await repository.login(input);
      storage.setToken(session.token);
      return session.user;
    },

    async restore(signal?: AbortSignal): Promise<AuthUser | null> {
      if (!storage.getToken()) return null;
      try {
        return await repository.me(signal);
      } catch (error) {
        if (!isApiError(error, 'unauthorized')) throw error;
        storage.clear();
        return null;
      }
    },

    logout(): void {
      storage.clear();
    },
  };
}

export const authService = createAuthService(authRepository);
