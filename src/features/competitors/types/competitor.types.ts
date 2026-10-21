import type { z } from 'zod';

import type { BusinessStats } from '@/features/analytics/types/stats.types';
import type { Business } from '@/features/businesses/types/business.types';

import type {
  COMPETITOR_SORTS,
  competitorQuerySchema,
  competitorSchema,
} from '../schemas/competitor.schema';

export type Competitor = z.infer<typeof competitorSchema>;
export type CompetitorSort = (typeof COMPETITOR_SORTS)[number];
export type CompetitorQuery = z.output<typeof competitorQuerySchema>;

export interface ComparisonRow {
  business: Business;
  stats: BusinessStats;
  isOwn: boolean;

  ratingDelta: number | null;
  negativeShare: number;
  trend: TrendDirection;
}

export type TrendDirection = 'up' | 'down' | 'flat' | 'unknown';
