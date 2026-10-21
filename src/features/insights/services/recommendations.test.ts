import { describe, expect, it } from 'vitest';

import type { TopicInsight } from '../types/insight.types';

import { buildSummary } from './recommendations';

const topic = (name: TopicInsight['topic'], count: number): TopicInsight => ({
  topic: name,
  count,
  share: count / 10,
  keyword: name,
  example: null,
});

const base = {
  businessName: 'Bella Pizza',
  periodLabel: 'posledních 90 dní',
  averageRating: 3.3,
  reviewCount: 80,
  negativeCount: 10,
  score: { score: 42, level: 'risk' as const, factors: [] },
};

describe('buildSummary', () => {
  it('warns about a decline and recommends actions for the top complaint topics', () => {
    const summary = buildSummary({
      ...base,
      ratingChange: -0.5,
      topics: [topic('temperature', 5), topic('delivery', 3), topic('price', 0)],
    });

    expect(summary.headline).toMatch(/zhoršuje/);
    expect(summary.sentences.join(' ')).toContain('studené jídlo (5×)');
    expect(summary.recommendations).toHaveLength(2);
    expect(summary.recommendations[0]).toMatch(/termobox/);
  });

  it('acknowledges improvement and skips empty topics', () => {
    const summary = buildSummary({ ...base, ratingChange: 0.3, negativeCount: 0, topics: [] });
    expect(summary.headline).toMatch(/zlepšuje/);
    expect(summary.recommendations).toEqual([]);
  });
});
