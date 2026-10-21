import { reviewRepository, type ReviewRepository } from '../repositories';
import { MAX_STARS, MIN_STARS, NEGATIVE_MAX_STARS } from '../schemas/review.schema';
import type { Review, ReviewPage, ReviewQuery } from '../types/review.types';

export const LATEST_REVIEWS_LIMIT = 5;

const DEFAULT_QUERY: ReviewQuery = {
  page: 1,
  pageSize: LATEST_REVIEWS_LIMIT,
  minStars: MIN_STARS,
  maxStars: MAX_STARS,
  search: '',
  sort: 'newest',
};

export function createReviewService(repository: ReviewRepository) {
  return {
    listReviews(businessId: string, query: ReviewQuery, signal?: AbortSignal): Promise<ReviewPage> {
      return repository.list(businessId, query, signal);
    },

    async getLatestReviews(
      businessId: string,
      limit = LATEST_REVIEWS_LIMIT,
      signal?: AbortSignal,
    ): Promise<Review[]> {
      const page = await repository.list(businessId, { ...DEFAULT_QUERY, pageSize: limit }, signal);
      return page.data;
    },

    getNegativeReviews(
      businessId: string,
      options: { limit: number; from?: string; to?: string },
      signal?: AbortSignal,
    ): Promise<ReviewPage> {
      return repository.list(
        businessId,
        {
          ...DEFAULT_QUERY,
          pageSize: options.limit,
          maxStars: NEGATIVE_MAX_STARS,
          from: options.from,
          to: options.to,
        },
        signal,
      );
    },
  };
}

export type ReviewService = ReturnType<typeof createReviewService>;

export const reviewService = createReviewService(reviewRepository);
