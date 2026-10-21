import { z } from 'zod';

import { reviewSchema } from '@/features/reviews/schemas/review.schema';

export const COMPLAINT_TOPICS = [
  'temperature',
  'delivery',
  'waiting',
  'staff',
  'quality',
  'cleanliness',
  'price',
  'management',
] as const;

export const topicInsightSchema = z.object({
  topic: z.enum(COMPLAINT_TOPICS),

  count: z.number().int().nonnegative(),

  share: z.number().min(0).max(1),

  keyword: z.string(),
  example: reviewSchema.nullable(),
});
