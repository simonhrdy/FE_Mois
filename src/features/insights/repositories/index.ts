import { apiClient } from '@/lib/api/client';
import { env } from '@/lib/config/env';
import { getMockDatabase } from '@/mocks/mock-db';

import { createHttpInsightRepository } from './http-insight.repository';
import { createMockInsightRepository } from './mock-insight.repository';

export type { InsightRepository } from './insight.repository';

export const insightRepository = env.apiMocking
  ? createMockInsightRepository(getMockDatabase)
  : createHttpInsightRepository(apiClient);
