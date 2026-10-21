import type { DateRange } from '@/features/analytics/types/stats.types';

import { insightRepository, type InsightRepository } from '../repositories';
import type { TopicInsight } from '../types/insight.types';

export function createInsightService(repository: InsightRepository) {
  return {
    async getTopics(
      businessId: string,
      range: DateRange,
      signal?: AbortSignal,
    ): Promise<TopicInsight[]> {
      const topics = await repository.getTopics(businessId, range, signal);
      return [...topics].sort((a, b) => b.count - a.count);
    },
  };
}

export type InsightService = ReturnType<typeof createInsightService>;

export const insightService = createInsightService(insightRepository);
