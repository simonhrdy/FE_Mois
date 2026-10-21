import { apiClient } from '@/lib/api/client';
import { env } from '@/lib/config/env';
import { getMockDatabase } from '@/mocks/mock-db';

import { createHttpCompetitorRepository } from './http-competitor.repository';
import { createMockCompetitorRepository } from './mock-competitor.repository';

export type { CompetitorRepository } from './competitor.repository';

export const competitorRepository = env.apiMocking
  ? createMockCompetitorRepository(getMockDatabase)
  : createHttpCompetitorRepository(apiClient);
