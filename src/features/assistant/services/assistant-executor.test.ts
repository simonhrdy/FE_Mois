import { describe, expect, it, vi } from 'vitest';

import type { AnalyticsService } from '@/features/analytics/services/analytics.service';
import type { CompetitorService } from '@/features/competitors/services/competitor.service';
import type { InsightService } from '@/features/insights/services/insight.service';
import type { ReviewService } from '@/features/reviews/services/review.service';

import { createAssistantExecutor } from './assistant-executor';

function setup() {
  const reviews = {
    getNegativeReviews: vi.fn().mockResolvedValue({
      data: [],
      meta: { page: 1, pageSize: 5, totalItems: 12, totalPages: 3 },
    }),
  };
  const competitors = {
    getTopRated: vi.fn().mockResolvedValue([{ id: 'rival-1' }, { id: 'rival-2' }]),
    compare: vi.fn().mockResolvedValue([]),
  };
  const analytics = { getStats: vi.fn() };
  const insights = { getTopics: vi.fn().mockResolvedValue([]) };
  const execute = createAssistantExecutor({
    reviews: reviews as unknown as ReviewService,
    competitors: competitors as unknown as CompetitorService,
    analytics: analytics as unknown as AnalyticsService,
    insights: insights as unknown as InsightService,
  });
  return { execute, reviews, competitors };
}

describe('assistant executor', () => {
  it('calls the same IS services the UI uses and passes results between tools', async () => {
    const { execute, reviews, competitors } = setup();

    const response = await execute(
      [
        { name: 'search_reviews', arguments: { maxStars: 2, limit: 5 } },
        { name: 'find_competitors', arguments: { sort: 'rating', limit: 2 } },
        { name: 'compare_businesses', arguments: { months: 12 } },
      ],
      'bella',
    );

    expect(reviews.getNegativeReviews).toHaveBeenCalledWith('bella', { limit: 5 }, undefined);
    expect(competitors.getTopRated).toHaveBeenCalledWith('bella', 2, undefined);
    expect(competitors.compare).toHaveBeenCalledWith(
      'bella',
      ['rival-1', 'rival-2'],
      12,
      undefined,
    );
    expect(response.toolCalls).toHaveLength(3);
    expect(response.results.map((result) => result.type)).toEqual(['reviews', 'comparison']);
    expect(response.answer).toContain('12 negativních recenzí');
  });

  it('answers with help text when nothing can be planned', async () => {
    const { execute } = setup();
    const response = await execute([], 'bella');
    expect(response.toolCalls).toEqual([]);
    expect(response.answer).toMatch(/negativní recenze/);
  });
});
