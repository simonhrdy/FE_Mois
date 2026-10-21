import { describe, expect, it } from 'vitest';

import { computeReputationScore, levelOf } from './reputation-score';

describe('computeReputationScore', () => {
  it('rewards a strong, growing business ahead of competitors', () => {
    const result = computeReputationScore({
      averageRating: 4.8,
      negativeShare: 0.02,
      ratingChange: 0.4,
      benchmarkDelta: 0.6,
    });
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.level).toBe('excellent');
  });

  it('penalises a declining business behind competitors', () => {
    const result = computeReputationScore({
      averageRating: 3.2,
      negativeShare: 0.3,
      ratingChange: -0.6,
      benchmarkDelta: -0.8,
    });
    expect(result.score).toBeLessThan(40);
    expect(result.level).toBe('critical');
  });

  it('explains the score with weighted factors that add up', () => {
    const { score, factors } = computeReputationScore({
      averageRating: 3,
      negativeShare: 0.2,
      ratingChange: 0,
      benchmarkDelta: 0,
    });
    expect(factors.map((factor) => factor.id)).toEqual([
      'rating',
      'negative',
      'momentum',
      'benchmark',
    ]);
    expect(factors.reduce((sum, factor) => sum + factor.weight, 0)).toBeCloseTo(1);
    expect(factors.find((factor) => factor.id === 'rating')?.value).toBe(50);
    expect(factors.find((factor) => factor.id === 'momentum')?.value).toBe(50);
    expect(score).toBe(50);
  });

  it('treats missing data as neutral', () => {
    const { factors } = computeReputationScore({
      averageRating: null,
      negativeShare: 0,
      ratingChange: null,
      benchmarkDelta: null,
    });
    expect(factors.filter((factor) => factor.value === 50)).toHaveLength(3);
  });
});

describe('levelOf', () => {
  it('maps score thresholds to levels', () => {
    expect([90, 70, 42, 10].map(levelOf)).toEqual(['excellent', 'good', 'risk', 'critical']);
  });
});
