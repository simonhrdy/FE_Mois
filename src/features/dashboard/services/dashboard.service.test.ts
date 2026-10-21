import { describe, expect, it } from 'vitest';

import { businessFixture } from '@/test/fixtures';

import { summarizeCompetition } from './dashboard.service';

const competitor = (id: string, stars: number) => ({
  ...businessFixture({ id, stars }),
  latestReview: null,
});

describe('summarizeCompetition', () => {
  it('computes the rank of the owner among the category and the competitor average', () => {
    const summary = summarizeCompetition(businessFixture({ stars: 3.9 }), [
      competitor('a', 4.5),
      competitor('b', 4.2),
      competitor('c', 3.5),
      competitor('d', 3.0),
    ]);

    expect(summary).toMatchObject({ rank: 3, total: 5, averageRating: 3.8 });
    expect(summary.top.map((item) => item.id)).toEqual(['a', 'b', 'c']);
    expect(summary.ranking.map((entry) => entry.id)).toEqual(['a', 'b', 'bella', 'c', 'd']);
    expect(summary.ranking[2]?.isOwn).toBe(true);
  });

  it('handles a business without competitors', () => {
    expect(summarizeCompetition(businessFixture(), [])).toMatchObject({
      rank: 1,
      total: 1,
      averageRating: null,
    });
  });
});
