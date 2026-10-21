import type { ComparisonRow } from '../types/competitor.types';

export const RADAR_METRICS = [
  'Hodnocení',
  'Spokojenost',
  'Málo stížností',
  'Objem recenzí',
  'Momentum',
] as const;

const MAX = 100;
const MIN_RATING = 1;
const RATING_SPAN = 4;
const POSITIVE_FROM_STARS = 4;

const MOMENTUM_RANGE = 0.5;
const MOMENTUM_WINDOW = 3;
const NEUTRAL = 50;

const clamp = (value: number) => Math.round(Math.min(MAX, Math.max(0, value)));

function positiveShare(distribution: readonly number[]): number {
  const total = distribution.reduce((sum, count) => sum + count, 0);
  const positive = distribution
    .slice(POSITIVE_FROM_STARS - 1)
    .reduce((sum, count) => sum + count, 0);
  return total > 0 ? positive / total : 0;
}

function momentum(row: ComparisonRow): number {
  const ratings = row.stats.monthly
    .map((point) => point.averageRating)
    .filter((value): value is number => value !== null);
  const recent = ratings.slice(-MOMENTUM_WINDOW);
  const before = ratings.slice(-2 * MOMENTUM_WINDOW, -MOMENTUM_WINDOW);
  if (recent.length === 0 || before.length === 0) return NEUTRAL;
  const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
  return clamp(((mean(recent) - mean(before) + MOMENTUM_RANGE) / (2 * MOMENTUM_RANGE)) * MAX);
}

export function radarProfile(row: ComparisonRow, maxReviewCount: number): number[] {
  return [
    row.stats.averageRating === null
      ? 0
      : clamp(((row.stats.averageRating - MIN_RATING) / RATING_SPAN) * MAX),
    clamp(positiveShare(row.stats.distribution) * MAX),
    clamp((1 - row.negativeShare) * MAX),
    maxReviewCount > 0 ? clamp((row.stats.reviewCount / maxReviewCount) * MAX) : 0,
    momentum(row),
  ];
}

export function radarSeries(rows: readonly ComparisonRow[]) {
  const maxReviewCount = Math.max(0, ...rows.map((row) => row.stats.reviewCount));
  const own = rows.find((row) => row.isOwn);
  const others = rows.filter((row) => !row.isOwn).map((row) => radarProfile(row, maxReviewCount));
  const average = RADAR_METRICS.map((_, index) =>
    others.length > 0
      ? clamp(others.reduce((sum, profile) => sum + (profile[index] ?? 0), 0) / others.length)
      : 0,
  );
  return { own: own ? radarProfile(own, maxReviewCount) : [], competitors: average };
}
