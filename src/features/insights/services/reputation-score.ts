import type { ReputationLevel, ReputationScore, ScoreFactor } from '../types/insight.types';

export interface ScoreInput {
  averageRating: number | null;
  negativeShare: number;

  ratingChange: number | null;

  benchmarkDelta: number | null;
}

const MAX_SCORE = 100;
const MIN_RATING = 1;
const RATING_SPAN = 4;

const NEGATIVE_SHARE_CEILING = 0.4;

const MOMENTUM_RANGE = 0.5;

const BENCHMARK_RANGE = 1;
const NEUTRAL = 50;

const WEIGHTS = { rating: 0.5, negative: 0.2, momentum: 0.15, benchmark: 0.15 } as const;

const LEVEL_THRESHOLDS: readonly [number, ReputationLevel][] = [
  [80, 'excellent'],
  [65, 'good'],
  [40, 'risk'],
];

const clamp = (value: number) => Math.min(MAX_SCORE, Math.max(0, value));
const linear = (value: number | null, range: number) =>
  value === null ? NEUTRAL : clamp(((value + range) / (2 * range)) * MAX_SCORE);

export function levelOf(score: number): ReputationLevel {
  return LEVEL_THRESHOLDS.find(([threshold]) => score >= threshold)?.[1] ?? 'critical';
}

export function computeReputationScore(input: ScoreInput): ReputationScore {
  const rawFactors: ScoreFactor[] = [
    {
      id: 'rating',
      label: 'Průměrné hodnocení',
      weight: WEIGHTS.rating,
      value:
        input.averageRating === null
          ? NEUTRAL
          : clamp(((input.averageRating - MIN_RATING) / RATING_SPAN) * MAX_SCORE),
    },
    {
      id: 'negative',
      label: 'Málo negativních recenzí',
      weight: WEIGHTS.negative,
      value: clamp((1 - input.negativeShare / NEGATIVE_SHARE_CEILING) * MAX_SCORE),
    },
    {
      id: 'momentum',
      label: 'Vývoj hodnocení',
      weight: WEIGHTS.momentum,
      value: linear(input.ratingChange, MOMENTUM_RANGE),
    },
    {
      id: 'benchmark',
      label: 'Pozice vůči konkurenci',
      weight: WEIGHTS.benchmark,
      value: linear(input.benchmarkDelta, BENCHMARK_RANGE),
    },
  ];
  const factors = rawFactors.map((factor) => ({ ...factor, value: Math.round(factor.value) }));

  const score = Math.round(factors.reduce((sum, factor) => sum + factor.value * factor.weight, 0));
  return { score, level: levelOf(score), factors };
}
