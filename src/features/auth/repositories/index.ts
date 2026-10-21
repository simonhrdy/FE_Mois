import { apiClient } from '@/lib/api/client';
import { env } from '@/lib/config/env';
import { getMockDatabase } from '@/mocks/mock-db';

import { createHttpAuthRepository } from './http-auth.repository';
import { createMockAuthRepository } from './mock-auth.repository';

export type { AuthRepository } from './auth.repository';

export const authRepository = env.apiMocking
  ? createMockAuthRepository(getMockDatabase)
  : createHttpAuthRepository(apiClient);
