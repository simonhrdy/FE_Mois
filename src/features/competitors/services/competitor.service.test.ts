import { describe, expect, it, vi } from 'vitest';

import type { StatsRepository } from '@/features/analytics/repositories';
import type { BusinessRepository } from '@/features/businesses/repositories';
import { businessFixture, statsFixture } from '@/test/fixtures';

import type { CompetitorRepository } from '../repositories';

import { createCompetitorService } from './competitor.service';

describe('competitorService.compare', () => {
  it('returns own business and competitors sorted by rating with deltas against the owner', async () => {
    const ratings: Record<string, number> = { bella: 3.7, a: 4.4, b: 3.2 };
    const businesses: BusinessRepository = {
      getById: vi.fn(async (id: string) => businessFixture({ id, name: id })),
    };
    const stats: StatsRepository = {
      getStats: vi.fn(async (id: string) =>
        statsFixture({
          businessId: id,
          averageRating: ratings[id] ?? null,
          negativeCount: 1,
          reviewCount: 4,
        }),
      ),
    };
    const competitors: CompetitorRepository = {
      search: vi.fn(),
      getWatchlist: vi.fn(),
      watch: vi.fn(),
      unwatch: vi.fn(),
    };
    const service = createCompetitorService({
      competitors,
      businesses,
      stats,
      now: () => new Date('2026-10-09'),
    });

    const rows = await service.compare('bella', ['a', 'b', 'bella'], 12);

    expect(rows.map((row) => row.business.id)).toEqual(['a', 'bella', 'b']);
    expect(rows.find((row) => row.isOwn)?.ratingDelta).toBe(0);
    expect(rows.find((row) => row.business.id === 'a')?.ratingDelta).toBe(0.7);
    expect(rows.find((row) => row.business.id === 'b')?.ratingDelta).toBe(-0.5);
    expect(rows[0]?.negativeShare).toBe(0.25);
    expect(businesses.getById).toHaveBeenCalledTimes(3);
  });
});
