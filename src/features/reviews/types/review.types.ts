import type { z } from 'zod';

import type { PaginatedResponse } from '@/types/api';

import type { REVIEW_SORTS, reviewQuerySchema, reviewSchema } from '../schemas/review.schema';

export type Review = z.infer<typeof reviewSchema>;
export type ReviewSort = (typeof REVIEW_SORTS)[number];
export type ReviewQuery = z.output<typeof reviewQuerySchema>;
export type ReviewPage = PaginatedResponse<Review>;
