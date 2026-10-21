'use client';

import { useCallback } from 'react';

import { useAsyncData } from '@/lib/hooks/use-async-data';

import { reviewService } from '../services/review.service';
import type { ReviewQuery } from '../types/review.types';

export function useReviews(businessId: string, query: ReviewQuery) {
  const { page, pageSize, minStars, maxStars, from, to, search, sort } = query;
  const fetcher = useCallback(
    (signal: AbortSignal) =>
      reviewService.listReviews(
        businessId,
        { page, pageSize, minStars, maxStars, from, to, search, sort },
        signal,
      ),
    [businessId, page, pageSize, minStars, maxStars, from, to, search, sort],
  );
  return useAsyncData(fetcher);
}

export function useLatestReviews(businessId: string, limit?: number) {
  const fetcher = useCallback(
    (signal: AbortSignal) => reviewService.getLatestReviews(businessId, limit, signal),
    [businessId, limit],
  );
  return useAsyncData(fetcher);
}
