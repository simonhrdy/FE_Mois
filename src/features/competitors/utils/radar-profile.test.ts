import { describe, expect, it } from 'vitest';

import { businessFixture, statsFixture } from '@/test/fixtures';

import type { ComparisonRow } from '../types/competitor.types';

import { radarProfile, radarSeries } from './radar-profile';

const row = (
  id: string,
  isOwn: boolean,
  averageRating: number,
  reviewCount: number,
): ComparisonRow => ({
  business: businessFixture({ id }),
  stats: statsFixture({
    businessId: id,
    averageRating,
    reviewCount,
    distribution: [0, 0, 0, 5, 5],
  }),
  isOwn,
  ratingDelta: 0,
  negativeShare: 0.1,
  trend: 'flat',
});

describe('radar profile', () => {
  it('normalises metrics to 0–100', () => {
    expect(radarProfile(row('a', true, 5, 50), 100)).toEqual([100, 100, 90, 50, 50]);
  });

  it('averages competitors and keeps the own profile separate', () => {
    const { own, competitors } = radarSeries([
      row('own', true, 3, 100),
      row('a', false, 5, 50),
      row('b', false, 4, 100),
    ]);
    expect(own[0]).toBe(50);
    expect(competitors[0]).toBe(88);
    expect(competitors[3]).toBe(75);
  });
});
