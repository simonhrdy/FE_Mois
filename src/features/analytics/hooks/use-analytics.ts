'use client';

import { useCallback } from 'react';

import { useAsyncData } from '@/lib/hooks/use-async-data';

import { analyticsService } from '../services/analytics.service';
import type { AnalyticsPeriod, DateRange } from '../types/stats.types';

export function useAnalyticsReport(businessId: string, months: AnalyticsPeriod) {
  const fetcher = useCallback(
    (signal: AbortSignal) => analyticsService.getReport(businessId, months, signal),
    [businessId, months],
  );
  return useAsyncData(fetcher);
}

export function useBusinessStats(businessId: string, { from, to }: DateRange) {
  const fetcher = useCallback(
    (signal: AbortSignal) => analyticsService.getStats(businessId, { from, to }, signal),
    [businessId, from, to],
  );
  return useAsyncData(fetcher);
}
