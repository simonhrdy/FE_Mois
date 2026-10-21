import { apiClient } from '@/lib/api/client';
import { env } from '@/lib/config/env';
import { getMockDatabase } from '@/mocks/mock-db';

import { createHttpBusinessRepository } from './http-business.repository';
import { createMockBusinessRepository } from './mock-business.repository';

export type { BusinessRepository } from './business.repository';

export const businessRepository = env.apiMocking
  ? createMockBusinessRepository(getMockDatabase)
  : createHttpBusinessRepository(apiClient);
