import type { ReviewPage, ReviewQuery } from '../types/review.types';

export interface ReviewRepository {
  list(businessId: string, query: ReviewQuery, signal?: AbortSignal): Promise<ReviewPage>;
}
