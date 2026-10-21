import { describe, expect, it, vi } from 'vitest';

import type { CompetitorRepository } from '@/features/competitors/repositories';
import { businessFixture, statsFixture } from '@/test/fixtures';

import type { StatsRepository } from '../repositories';

import { createAnalyticsService } from './analytics.service';

const NOW = new Date('2026-10-09T00:00:00Z');

function setup(watched: string[]) {
  const ratings: Record<string, number> = {
    bella: 3.6,
    'rival-1': 4.4,
    'rival-2': 4.0,
    'rival-3': 3.0,
  };
  const stats: StatsRepository = {
    getStats: vi.fn(async (id: string, range) =>
      statsFixture({
        businessId: id,
        ...range,
        averageRating: ratings[id] ?? null,
        reviewCount: 10,
      }),
    ),
  };
  const competitors: CompetitorRepository = {
    search: vi.fn(async () => [{ ...businessFixture({ id: 'rival-3' }), latestReview: null }]),
    getWatchlist: vi.fn(async () => watched.map((id) => businessFixture({ id }))),
    watch: vi.fn(),
    unwatch: vi.fn(),
  };
  return {
    service: createAnalyticsService({ stats, competitors, now: () => NOW }),
    stats,
    competitors,
  };
}

describe('analyticsService.getReport', () => {
  it('benchmarks against watched competitors when there are any', async () => {
    const { service, competitors } = setup(['rival-1', 'rival-2']);

    const report = await service.getReport('bella', 12);

    expect(report.benchmark).toMatchObject({
      source: 'watchlist',
      businessCount: 2,
      averageRating: 4.2,
    });
    expect(report.benchmarkDelta).toBe(-0.6);
    expect(competitors.search).not.toHaveBeenCalled();
    expect(report.range).toEqual({ from: '2025-10-09', to: '2026-10-09' });
  });

  it('falls back to the whole category when nobody is watched', async () => {
    const { service } = setup([]);

    const report = await service.getReport('bella', 3);

    expect(report.benchmark).toMatchObject({
      source: 'category',
      businessCount: 1,
      averageRating: 3,
    });
    expect(report.benchmarkDelta).toBe(0.6);
  });

  it('compares the period with the previous period of the same length', async () => {
    const { service, stats } = setup([]);

    await service.getReport('bella', 3);

    expect(stats.getStats).toHaveBeenCalledWith(
      'bella',
      { from: '2026-07-09', to: '2026-10-09' },
      undefined,
    );
    expect(stats.getStats).toHaveBeenCalledWith(
      'bella',
      { from: '2026-04-07', to: '2026-07-08' },
      undefined,
    );
  });
});
