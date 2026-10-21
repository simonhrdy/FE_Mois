import { describe, expect, it } from 'vitest';

import { reviewQuerySchema } from './review.schema';

describe('reviewQuerySchema', () => {
  it('applies defaults for an empty query string', () => {
    expect(reviewQuerySchema.parse({})).toEqual({
      page: 1,
      pageSize: 10,
      minStars: 1,
      maxStars: 5,
      from: undefined,
      to: undefined,
      search: '',
      sort: 'newest',
    });
  });

  it('coerces URL values and keeps valid filters', () => {
    const query = reviewQuerySchema.parse({
      page: '3',
      maxStars: '2',
      from: '2026-01-01',
      sort: 'lowest',
      search: '  cold pizza ',
    });
    expect(query).toMatchObject({
      page: 3,
      minStars: 1,
      maxStars: 2,
      from: '2026-01-01',
      sort: 'lowest',
      search: 'cold pizza',
    });
  });

  it('falls back to defaults for invalid values instead of failing', () => {
    const query = reviewQuerySchema.parse({ minStars: '9', sort: 'random', from: 'yesterday' });
    expect(query).toMatchObject({ minStars: 1, sort: 'newest', from: undefined });
  });

  it('swaps an inverted star range', () => {
    expect(reviewQuerySchema.parse({ minStars: '4', maxStars: '2' })).toMatchObject({
      minStars: 2,
      maxStars: 4,
    });
  });
});
