import type { ApiClient } from '@/lib/api/client';
import { businessEndpoints } from '@/lib/api/endpoints/businesses';
import { paginatedResponseSchema } from '@/lib/api/schemas';

import { reviewSchema } from '../schemas/review.schema';

import type { ReviewRepository } from './review.repository';

const reviewPageResponse = paginatedResponseSchema(reviewSchema);

export function createHttpReviewRepository(client: ApiClient): ReviewRepository {
  return {
    list: (businessId, query, signal) =>
      client.get(businessEndpoints.reviews(businessId), reviewPageResponse, {
        query: { ...query },
        signal,
      }),
  };
}
