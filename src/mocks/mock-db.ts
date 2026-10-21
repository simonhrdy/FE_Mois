import { z } from 'zod';

import type { BusinessStats, DateRange, RatingPoint } from '@/features/analytics/types/stats.types';
import type { AuthUser, Session } from '@/features/auth/types/auth.types';
import type { Business } from '@/features/businesses/types/business.types';
import { WATCHLIST_LIMIT } from '@/features/competitors/schemas/competitor.schema';
import type { Competitor, CompetitorQuery } from '@/features/competitors/types/competitor.types';
import { COMPLAINT_TOPICS } from '@/features/insights/schemas/insight.schema';
import type { TopicInsight } from '@/features/insights/types/insight.types';
import { NEGATIVE_MAX_STARS } from '@/features/reviews/schemas/review.schema';
import type { Review, ReviewPage, ReviewQuery } from '@/features/reviews/types/review.types';
import { ApiError, HTTP_STATUS } from '@/lib/api/errors';
import { monthKeysBetween } from '@/lib/utils/date';
import type { PaginatedResponse } from '@/types/api';

import { DEMO_ACCOUNT } from './mock-users';
import { TOPIC_RULES } from './topic-keywords';
import { averageStars, createYelpDataset, type YelpDataset } from './yelp-dataset';

const DEFAULT_LATENCY_MS = 350;
const WATCHLIST_STORAGE_KEY = 'ms.mock.watchlist';
const MOCK_TOKEN_PREFIX = 'mock-token-';

export function delay(ms: number = DEFAULT_LATENCY_MS, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

function notFound(what: string): ApiError {
  return new ApiError('not_found', `${what} not found`, { status: HTTP_STATUS.NOT_FOUND });
}

function paginate<T>(items: readonly T[], page: number, pageSize: number): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    meta: {
      page,
      pageSize,
      totalItems: items.length,
      totalPages: Math.ceil(items.length / pageSize),
    },
  };
}

const REVIEW_COMPARATORS: Record<ReviewQuery['sort'], (a: Review, b: Review) => number> = {
  newest: (a, b) => b.date.localeCompare(a.date),
  oldest: (a, b) => a.date.localeCompare(b.date),
  lowest: (a, b) => a.stars - b.stars || b.date.localeCompare(a.date),
  highest: (a, b) => b.stars - a.stars || b.date.localeCompare(a.date),
  useful: (a, b) => b.useful - a.useful || b.date.localeCompare(a.date),
};

const COMPETITOR_COMPARATORS: Record<
  CompetitorQuery['sort'],
  (a: Business, b: Business) => number
> = {
  rating: (a, b) => b.stars - a.stars || b.reviewCount - a.reviewCount,
  reviews: (a, b) => b.reviewCount - a.reviewCount,
  name: (a, b) => a.name.localeCompare(b.name),
};

const storedWatchlistSchema = z.record(z.string(), z.array(z.string())).catch({});

function readStoredWatchlist(): Record<string, string[]> {
  try {
    const raw = globalThis.localStorage?.getItem(WATCHLIST_STORAGE_KEY);
    return storedWatchlistSchema.parse(raw ? JSON.parse(raw) : {});
  } catch {
    return {};
  }
}

export class MockDatabase {
  private readonly dataset: YelpDataset;
  private watchlists: Record<string, string[]>;

  constructor(dataset: YelpDataset = createYelpDataset(), watchlists = readStoredWatchlist()) {
    this.dataset = dataset;
    this.watchlists = watchlists;
  }

  login(email: string, password: string): Session {
    if (email.toLowerCase() !== DEMO_ACCOUNT.email || password !== DEMO_ACCOUNT.password) {
      throw new ApiError('unauthorized', 'Invalid credentials', {
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }
    return { token: `${MOCK_TOKEN_PREFIX}${DEMO_ACCOUNT.id}`, user: this.demoUser() };
  }

  me(token: string | null): AuthUser {
    if (token !== `${MOCK_TOKEN_PREFIX}${DEMO_ACCOUNT.id}`) {
      throw new ApiError('unauthorized', 'Session expired', { status: HTTP_STATUS.UNAUTHORIZED });
    }
    return this.demoUser();
  }

  private demoUser(): AuthUser {
    return {
      id: DEMO_ACCOUNT.id,
      name: DEMO_ACCOUNT.name,
      email: DEMO_ACCOUNT.email,
      businesses: DEMO_ACCOUNT.businessIds.map((id) => {
        const { name, city } = this.business(id);
        return { id, name, city };
      }),
    };
  }

  business(id: string): Business {
    const business = this.dataset.businesses.find((item) => item.id === id);
    if (!business) throw notFound(`Business ${id}`);
    return business;
  }

  private reviewsOf(businessId: string): Review[] {
    return this.dataset.reviews.filter((review) => review.businessId === businessId);
  }

  reviews(businessId: string, query: ReviewQuery): ReviewPage {
    this.business(businessId);
    const search = query.search.toLowerCase();
    const filtered = this.reviewsOf(businessId)
      .filter((review) => review.stars >= query.minStars && review.stars <= query.maxStars)
      .filter((review) => !query.from || review.date.slice(0, 10) >= query.from)
      .filter((review) => !query.to || review.date.slice(0, 10) <= query.to)
      .filter((review) => !search || review.text.toLowerCase().includes(search))
      .sort(REVIEW_COMPARATORS[query.sort]);
    return paginate(filtered, query.page, query.pageSize);
  }

  stats(businessId: string, range: DateRange): BusinessStats {
    this.business(businessId);
    const inRange = this.reviewsOf(businessId).filter((review) => {
      const day = review.date.slice(0, 10);
      return day >= range.from && day <= range.to;
    });
    const distribution = [1, 2, 3, 4, 5].map(
      (stars) => inRange.filter((review) => review.stars === stars).length,
    );
    const monthly: RatingPoint[] = monthKeysBetween(range.from, range.to).map((period) => {
      const month = inRange.filter((review) => review.date.startsWith(period));
      return {
        period,
        averageRating: averageStars(month),
        reviewCount: month.length,
        negativeCount: month.filter((review) => review.stars <= NEGATIVE_MAX_STARS).length,
      };
    });

    return {
      businessId,
      ...range,
      averageRating: averageStars(inRange),
      reviewCount: inRange.length,
      negativeCount: inRange.filter((review) => review.stars <= NEGATIVE_MAX_STARS).length,
      distribution,
      monthly,
    };
  }

  topics(businessId: string, range: DateRange): TopicInsight[] {
    this.business(businessId);
    const negative = this.reviewsOf(businessId)
      .filter((review) => review.stars <= NEGATIVE_MAX_STARS)
      .filter((review) => {
        const day = review.date.slice(0, 10);
        return day >= range.from && day <= range.to;
      })
      .sort(REVIEW_COMPARATORS.newest);

    return COMPLAINT_TOPICS.map((topic) => {
      const { pattern, keyword } = TOPIC_RULES[topic];
      const matching = negative.filter((review) => pattern.test(review.text));
      return {
        topic,
        keyword,
        count: matching.length,
        share: negative.length > 0 ? matching.length / negative.length : 0,
        example: matching[0] ?? null,
      };
    }).sort((a, b) => b.count - a.count);
  }

  competitors(businessId: string, query: CompetitorQuery): Competitor[] {
    const own = this.business(businessId);
    const primaryCategory = own.categories[0];
    const ownIds = new Set<string>(DEMO_ACCOUNT.businessIds);
    const search = query.search.toLowerCase();

    return this.dataset.businesses
      .filter((business) => !ownIds.has(business.id) && business.city === own.city)
      .filter(
        (business) =>
          primaryCategory !== undefined && business.categories.includes(primaryCategory),
      )
      .filter((business) => !search || business.name.toLowerCase().includes(search))
      .sort(COMPETITOR_COMPARATORS[query.sort])
      .map((business) => ({ ...business, latestReview: this.latestReview(business.id) }));
  }

  private latestReview(businessId: string): Review | null {
    return this.reviewsOf(businessId).sort(REVIEW_COMPARATORS.newest)[0] ?? null;
  }

  watchlist(businessId: string): Business[] {
    return (this.watchlists[businessId] ?? []).map((id) => this.business(id));
  }

  watch(businessId: string, competitorId: string): void {
    this.business(competitorId);
    const current = this.watchlists[businessId] ?? [];
    if (current.includes(competitorId)) return;
    if (current.length >= WATCHLIST_LIMIT) {
      throw new ApiError('conflict', 'Watchlist limit reached', { status: HTTP_STATUS.CONFLICT });
    }
    this.saveWatchlist(businessId, [...current, competitorId]);
  }

  unwatch(businessId: string, competitorId: string): void {
    const current = this.watchlists[businessId] ?? [];
    this.saveWatchlist(
      businessId,
      current.filter((id) => id !== competitorId),
    );
  }

  private saveWatchlist(businessId: string, ids: string[]): void {
    this.watchlists = { ...this.watchlists, [businessId]: ids };
    try {
      globalThis.localStorage?.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(this.watchlists));
    } catch {
      return;
    }
  }
}

let instance: MockDatabase | null = null;

export function getMockDatabase(): MockDatabase {
  instance ??= new MockDatabase();
  return instance;
}
