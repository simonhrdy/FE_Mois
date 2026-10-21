import type { z } from 'zod';

import type {
  ANALYTICS_PERIODS,
  businessStatsSchema,
  ratingPointSchema,
} from '../schemas/stats.schema';

export type RatingPoint = z.infer<typeof ratingPointSchema>;
export type BusinessStats = z.infer<typeof businessStatsSchema>;

export type AnalyticsPeriod = (typeof ANALYTICS_PERIODS)[number];

export interface DateRange {
  from: string;
  to: string;
}
