'use client';

import { useCallback } from 'react';

import { useAsyncData } from '@/lib/hooks/use-async-data';

import { businessService } from '../services/business.service';

export function useBusiness(id: string) {
  const fetcher = useCallback(
    (signal: AbortSignal) => businessService.getBusiness(id, signal),
    [id],
  );
  return useAsyncData(fetcher);
}
