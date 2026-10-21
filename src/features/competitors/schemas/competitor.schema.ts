import { z } from 'zod';

import { businessSchema } from '@/features/businesses/schemas/business.schema';
import { reviewSchema } from '@/features/reviews/schemas/review.schema';

export const WATCHLIST_LIMIT = 5;

export const COMPETITOR_SORTS = ['rating', 'reviews', 'name'] as const;

export const competitorSchema = businessSchema.extend({
  latestReview: reviewSchema.nullable(),
});

export const competitorQuerySchema = z.object({
  search: z.string().trim().catch(''),
  sort: z.enum(COMPETITOR_SORTS).catch('rating'),
});
