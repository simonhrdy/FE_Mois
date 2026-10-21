import { describe, expect, it } from 'vitest';

import type { BusinessStats, RatingPoint } from '../types/stats.types';

import {
  combineMonthly,
  directionOf,
  negativeShare,
  trendDirection,
  weightedAverage,
} from './rating-math';

const point = (period: string, averageRating: number | null, reviewCount: number): RatingPoint => ({
  period,
  averageRating,
  reviewCount,
  negativeCount: 0,
});

describe('weightedAverage', () => {
  it('weights ratings by the number of reviews and skips empty months', () => {
    expect(
      weightedAverage([point('2026-01', 5, 1), point('2026-02', 3, 3), point('2026-03', null, 0)]),
    ).toBe(3.5);
  });

  it('returns null without any reviews', () => {
    expect(weightedAverage([point('2026-01', null, 0)])).toBeNull();
  });
});

describe('trendDirection', () => {
  const series = (values: number[]) =>
    values.map((value, index) => point(`2026-0${index + 1}`, value, 10));

  it('detects a decline of the last three months against the three before', () => {
    expect(trendDirection(series([4.2, 4.2, 4.1, 3.6, 3.4, 3.2]))).toBe('down');
  });

  it('detects growth', () => {
    expect(trendDirection(series([3.5, 3.6, 3.5, 4, 4.1, 4.2]))).toBe('up');
  });

  it('treats small changes as stable', () => {
    expect(trendDirection(series([4, 4, 4, 4.05, 4, 3.98]))).toBe('flat');
  });

  it('reports unknown without enough history', () => {
    expect(trendDirection(series([4]))).toBe('unknown');
  });
});

describe('directionOf', () => {
  it('maps a rating change to a direction using a threshold', () => {
    expect(directionOf(0.3)).toBe('up');
    expect(directionOf(-0.3)).toBe('down');
    expect(directionOf(0.05)).toBe('flat');
    expect(directionOf(null)).toBe('unknown');
  });
});

describe('negativeShare', () => {
  it('handles businesses without reviews', () => {
    expect(negativeShare({ negativeCount: 0, reviewCount: 0 })).toBe(0);
    expect(negativeShare({ negativeCount: 5, reviewCount: 20 })).toBe(0.25);
  });
});

describe('combineMonthly', () => {
  it('merges several businesses into one review-weighted series', () => {
    const stats = (monthly: RatingPoint[]): BusinessStats => ({
      businessId: 'x',
      from: '2026-01-01',
      to: '2026-02-28',
      averageRating: null,
      reviewCount: 0,
      negativeCount: 0,
      distribution: [0, 0, 0, 0, 0],
      monthly,
    });

    const combined = combineMonthly([
      stats([point('2026-01', 4, 10), point('2026-02', 5, 1)]),
      stats([point('2026-01', 2, 10), point('2026-02', 3, 3)]),
    ]);

    expect(combined).toEqual([
      { period: '2026-01', averageRating: 3, reviewCount: 20, negativeCount: 0 },
      { period: '2026-02', averageRating: 3.5, reviewCount: 4, negativeCount: 0 },
    ]);
  });
});
