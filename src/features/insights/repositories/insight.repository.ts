import type { DateRange } from '@/features/analytics/types/stats.types';

import type { TopicInsight } from '../types/insight.types';

export interface InsightRepository {
  getTopics(businessId: string, range: DateRange, signal?: AbortSignal): Promise<TopicInsight[]>;
}
