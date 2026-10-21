'use client';

import { useCallback } from 'react';

import { useAsyncData } from '@/lib/hooks/use-async-data';

import { dashboardService } from '../services/dashboard.service';

export function useDashboardOverview(businessId: string) {
  const fetcher = useCallback(
    (signal: AbortSignal) => dashboardService.getOverview(businessId, signal),
    [businessId],
  );
  return useAsyncData(fetcher);
}
