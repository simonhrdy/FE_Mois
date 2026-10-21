import { apiClient } from '@/lib/api/client';
import { env } from '@/lib/config/env';
import { getMockDatabase } from '@/mocks/mock-db';

import { createHttpReviewRepository } from './http-review.repository';
import { createMockReviewRepository } from './mock-review.repository';

export type { ReviewRepository } from './review.repository';

export const reviewRepository = env.apiMocking
  ? createMockReviewRepository(getMockDatabase)
  : createHttpReviewRepository(apiClient);
