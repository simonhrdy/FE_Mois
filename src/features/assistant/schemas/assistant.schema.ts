import { z } from 'zod';

import { ratingPointSchema } from '@/features/analytics/schemas/stats.schema';
import { topicInsightSchema } from '@/features/insights/schemas/insight.schema';
import { reviewSchema } from '@/features/reviews/schemas/review.schema';

export const PROMPT_MIN = 3;
export const PROMPT_MAX = 500;

export const ASSISTANT_TOOLS = [
  'search_reviews',
  'find_competitors',
  'compare_businesses',
  'get_rating_trend',
  'analyze_topics',
] as const;

export const promptSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(PROMPT_MIN, { error: 'Napište alespoň krátký dotaz' })
    .max(PROMPT_MAX, { error: `Dotaz může mít nejvýše ${PROMPT_MAX} znaků` }),
});

export const toolCallSchema = z.object({
  name: z.enum(ASSISTANT_TOOLS),
  arguments: z.record(z.string(), z.union([z.string(), z.number()])),
});

const comparisonEntrySchema = z.object({
  businessId: z.string(),
  name: z.string(),
  averageRating: z.number().nullable(),
  reviewCount: z.number().int().nonnegative(),
  negativeShare: z.number().min(0).max(1),
  isOwn: z.boolean(),
});

export const assistantResultSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('reviews'),
    title: z.string(),
    total: z.number().int().nonnegative(),
    reviews: z.array(reviewSchema),
  }),
  z.object({
    type: z.literal('comparison'),
    title: z.string(),
    rows: z.array(comparisonEntrySchema),
  }),
  z.object({
    type: z.literal('trend'),
    title: z.string(),
    points: z.array(ratingPointSchema),
  }),
  z.object({
    type: z.literal('topics'),
    title: z.string(),
    topics: z.array(topicInsightSchema),
  }),
]);

export const assistantResponseSchema = z.object({
  answer: z.string(),
  toolCalls: z.array(toolCallSchema),
  results: z.array(assistantResultSchema),
});
