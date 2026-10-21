import { describe, expect, it } from 'vitest';

import { reviewQuerySchema } from '@/features/reviews/schemas/review.schema';
import { lastDaysRange, lastMonthsRange } from '@/lib/utils/date';

import { MockDatabase } from './mock-db';
import { DEMO_ACCOUNT } from './mock-users';
import { createYelpDataset } from './yelp-dataset';

const NOW = new Date('2026-10-09T12:00:00Z');
const BELLA = 'bella-pizza-lv';

const createDb = () => new MockDatabase(createYelpDataset(NOW), {});
const query = (values: Record<string, string>) => reviewQuerySchema.parse(values);

describe('Yelp mock dataset', () => {
  it('is deterministic for the same reference date', () => {
    expect(createYelpDataset(NOW)).toEqual(createYelpDataset(NOW));
  });

  it('models Bella Pizza with a declining recent rating', () => {
    const db = createDb();
    const recent = db.stats(BELLA, lastDaysRange(90, NOW));
    const year = db.stats(BELLA, lastMonthsRange(12, NOW));
    expect(recent.averageRating).not.toBeNull();
    expect(recent.averageRating ?? 5).toBeLessThan(year.averageRating ?? 0);
  });
});

describe('MockDatabase reviews', () => {
  it('filters by star range, sorts and paginates', () => {
    const page = createDb().reviews(BELLA, query({ maxStars: '2', sort: 'oldest', pageSize: '5' }));

    expect(page.data).toHaveLength(5);
    expect(page.data.every((review) => review.stars <= 2)).toBe(true);
    const dates = page.data.map((review) => review.date);
    expect(dates).toEqual([...dates].sort());
    expect(page.meta.totalPages).toBe(Math.ceil(page.meta.totalItems / 5));
  });

  it('filters by date range and text', () => {
    const page = createDb().reviews(
      BELLA,
      query({ from: '2026-09-01', to: '2026-09-30', search: 'PIZZA' }),
    );
    expect(page.data.length).toBeGreaterThan(0);
    for (const review of page.data) {
      expect(
        review.date.slice(0, 10) >= '2026-09-01' && review.date.slice(0, 10) <= '2026-09-30',
      ).toBe(true);
      expect(review.text.toLowerCase()).toContain('pizza');
    }
  });
});

describe('MockDatabase stats', () => {
  it('aggregates consistent totals', () => {
    const stats = createDb().stats(BELLA, lastMonthsRange(12, NOW));
    const distributionTotal = stats.distribution.reduce((sum, count) => sum + count, 0);
    const monthlyTotal = stats.monthly.reduce((sum, month) => sum + month.reviewCount, 0);

    expect(distributionTotal).toBe(stats.reviewCount);
    expect(monthlyTotal).toBe(stats.reviewCount);
    expect(stats.negativeCount).toBe((stats.distribution[0] ?? 0) + (stats.distribution[1] ?? 0));
  });
});

describe('MockDatabase topics', () => {
  it('detects complaint topics in negative reviews, most frequent first', () => {
    const topics = createDb().topics(BELLA, lastMonthsRange(12, NOW));
    const counts = topics.map((topic) => topic.count);

    expect(counts).toEqual([...counts].sort((a, b) => b - a));
    expect(topics[0]?.count).toBeGreaterThan(0);
    expect(topics[0]?.example?.stars).toBeLessThanOrEqual(2);
    for (const topic of topics) expect(topic.share).toBeLessThanOrEqual(1);
  });
});

describe('MockDatabase competitors', () => {
  it('returns businesses of the same category and city, excluding own businesses', () => {
    const db = createDb();
    const competitors = db.competitors(BELLA, { search: '', sort: 'rating' });

    expect(competitors.length).toBeGreaterThan(0);
    for (const competitor of competitors) {
      expect(competitor.city).toBe('Las Vegas');
      expect(competitor.categories).toContain('Pizza');
      expect(DEMO_ACCOUNT.businessIds).not.toContain(competitor.id);
    }
    const ratings = competitors.map((competitor) => competitor.stars);
    expect(ratings).toEqual([...ratings].sort((a, b) => b - a));
  });

  it('enforces the watchlist limit with a conflict error', () => {
    const db = createDb();
    const ids = db
      .competitors(BELLA, { search: '', sort: 'rating' })
      .map((competitor) => competitor.id);
    for (const id of ids.slice(0, 5)) db.watch(BELLA, id);

    expect(db.watchlist(BELLA)).toHaveLength(5);
    expect(() => db.watch(BELLA, ids[5] ?? '')).toThrow(
      expect.objectContaining({ kind: 'conflict' }),
    );

    db.unwatch(BELLA, ids[0] ?? '');
    expect(db.watchlist(BELLA)).toHaveLength(4);
  });
});

describe('MockDatabase auth', () => {
  it('rejects invalid credentials with unauthorized', () => {
    expect(() => createDb().login(DEMO_ACCOUNT.email, 'wrong-password')).toThrow(
      expect.objectContaining({ kind: 'unauthorized' }),
    );
  });

  it('issues a session listing the owned businesses', () => {
    const db = createDb();
    const session = db.login(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password);
    expect(session.user.businesses.map((business) => business.id)).toEqual([
      ...DEMO_ACCOUNT.businessIds,
    ]);
    expect(db.me(session.token).email).toBe(DEMO_ACCOUNT.email);
  });
});
