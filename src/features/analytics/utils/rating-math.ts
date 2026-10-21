import type { TrendDirection } from '@/features/competitors/types/competitor.types';

import type { BusinessStats, RatingPoint } from '../types/stats.types';

export const TREND_WINDOW_MONTHS = 3;

export const TREND_THRESHOLD = 0.1;

type Weighted = Pick<RatingPoint, 'averageRating' | 'reviewCount'>;

const ROUNDING = 100;
const round = (value: number) => Math.round(value * ROUNDING) / ROUNDING;

export function weightedAverage(items: readonly Weighted[]): number | null {
  let total = 0;
  let count = 0;
  for (const { averageRating, reviewCount } of items) {
    if (averageRating === null || reviewCount === 0) continue;
    total += averageRating * reviewCount;
    count += reviewCount;
  }
  return count > 0 ? round(total / count) : null;
}

export function ratingDifference(current: number | null, previous: number | null): number | null {
  return current === null || previous === null ? null : round(current - previous);
}

export function directionOf(change: number | null): TrendDirection {
  if (change === null) return 'unknown';
  if (change >= TREND_THRESHOLD) return 'up';
  if (change <= -TREND_THRESHOLD) return 'down';
  return 'flat';
}

export function trendDirection(monthly: readonly RatingPoint[]): TrendDirection {
  const recent = monthly.slice(-TREND_WINDOW_MONTHS);
  const before = monthly.slice(-2 * TREND_WINDOW_MONTHS, -TREND_WINDOW_MONTHS);
  return directionOf(ratingDifference(weightedAverage(recent), weightedAverage(before)));
}

export function negativeShare(stats: Pick<BusinessStats, 'negativeCount' | 'reviewCount'>): number {
  return stats.reviewCount > 0 ? stats.negativeCount / stats.reviewCount : 0;
}

export function combineMonthly(statsList: readonly BusinessStats[]): RatingPoint[] {
  const periods = new Map<string, RatingPoint[]>();
  for (const stats of statsList) {
    for (const point of stats.monthly) {
      periods.set(point.period, [...(periods.get(point.period) ?? []), point]);
    }
  }
  return [...periods.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, points]) => ({
      period,
      averageRating: weightedAverage(points),
      reviewCount: points.reduce((sum, point) => sum + point.reviewCount, 0),
      negativeCount: points.reduce((sum, point) => sum + point.negativeCount, 0),
    }));
}
