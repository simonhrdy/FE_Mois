import type { Business } from '@/features/businesses/types/business.types';

import type { Competitor, CompetitorQuery } from '../types/competitor.types';

export interface CompetitorRepository {
  search(businessId: string, query: CompetitorQuery, signal?: AbortSignal): Promise<Competitor[]>;
  getWatchlist(businessId: string, signal?: AbortSignal): Promise<Business[]>;
  watch(businessId: string, competitorId: string): Promise<void>;
  unwatch(businessId: string, competitorId: string): Promise<void>;
}
