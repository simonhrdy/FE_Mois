import type { BusinessStats, DateRange } from '../types/stats.types';

export interface StatsRepository {
  getStats(businessId: string, range: DateRange, signal?: AbortSignal): Promise<BusinessStats>;
}
