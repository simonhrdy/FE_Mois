'use client';

import { useCallback, useState } from 'react';

import type { AnalyticsPeriod } from '@/features/analytics/types/stats.types';
import { getErrorMessage, isApiError } from '@/lib/api/errors';
import { useAsyncData } from '@/lib/hooks/use-async-data';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/notifications.slice';

import { WATCHLIST_LIMIT } from '../schemas/competitor.schema';
import { competitorService } from '../services/competitor.service';
import type { CompetitorQuery } from '../types/competitor.types';

export function useCompetitors(businessId: string, { search, sort }: CompetitorQuery) {
  const fetcher = useCallback(
    (signal: AbortSignal) =>
      competitorService.searchCompetitors(businessId, { search, sort }, signal),
    [businessId, search, sort],
  );
  return useAsyncData(fetcher);
}

export function useComparison(businessId: string, months: AnalyticsPeriod) {
  const fetcher = useCallback(
    (signal: AbortSignal) => competitorService.compareWithWatchlist(businessId, months, signal),
    [businessId, months],
  );
  return useAsyncData(fetcher);
}

interface WatchTarget {
  id: string;
  name: string;
}

export function useWatchlist(businessId: string, onChange?: () => void) {
  const dispatch = useAppDispatch();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const fetcher = useCallback(
    (signal: AbortSignal) => competitorService.getWatchlist(businessId, signal),
    [businessId],
  );
  const watchlist = useAsyncData(fetcher);
  const watched = watchlist.status === 'success' ? watchlist.data : watchlist.previousData;
  const watchedIds = new Set((watched ?? []).map((business) => business.id));

  const toggle = async ({ id, name }: WatchTarget) => {
    const watching = watchedIds.has(id);
    setPendingId(id);
    try {
      if (watching) await competitorService.unwatch(businessId, id);
      else await competitorService.watch(businessId, id);
      dispatch(
        showNotification(
          watching ? `${name} už nesledujete.` : `${name} přidán do sledované konkurence.`,
        ),
      );
      watchlist.reload();
      onChange?.();
    } catch (error) {
      const message = isApiError(error, 'conflict')
        ? `Sledovat můžete nejvýše ${WATCHLIST_LIMIT} konkurentů. Nejdřív některého odeberte.`
        : getErrorMessage(error);
      dispatch(showNotification(message, 'error'));
    } finally {
      setPendingId(null);
    }
  };

  return { watchlist, watchedIds, toggle, pendingId };
}
