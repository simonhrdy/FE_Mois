import { z } from 'zod';

export const ratingPointSchema = z.object({
  period: z.string().regex(/^\d{4}-\d{2}$/),
  averageRating: z.number().nullable(),
  reviewCount: z.number().int().nonnegative(),
  negativeCount: z.number().int().nonnegative(),
});

export const businessStatsSchema = z.object({
  businessId: z.string(),
  from: z.iso.date(),
  to: z.iso.date(),
  averageRating: z.number().nullable(),
  reviewCount: z.number().int().nonnegative(),
  negativeCount: z.number().int().nonnegative(),

  distribution: z.array(z.number().int().nonnegative()).length(5),
  monthly: z.array(ratingPointSchema),
});

export const ANALYTICS_PERIODS = [3, 6, 12, 24] as const;

export const DEFAULT_ANALYTICS_PERIOD = 12;

export const periodQuerySchema = z.object({
  months: z.coerce
    .number()
    .pipe(z.union(ANALYTICS_PERIODS.map((period) => z.literal(period))))
    .catch(DEFAULT_ANALYTICS_PERIOD),
});
