import { apiClient } from '@/lib/api/client';
import { env } from '@/lib/config/env';
import { getMockDatabase } from '@/mocks/mock-db';

import { createHttpStatsRepository } from './http-stats.repository';
import { createMockStatsRepository } from './mock-stats.repository';

export type { StatsRepository } from './stats.repository';

export const statsRepository = env.apiMocking
  ? createMockStatsRepository(getMockDatabase)
  : createHttpStatsRepository(apiClient);
