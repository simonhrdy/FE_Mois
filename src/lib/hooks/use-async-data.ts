'use client';

import { useCallback, useEffect, useState } from 'react';

import { isAbortError } from '@/lib/api/errors';
import type { AsyncState } from '@/types/common';

export type Fetcher<T> = (signal: AbortSignal) => Promise<T>;

export type AsyncDataResult<T> = AsyncState<T> & {
  reload: () => void;

  previousData: T | undefined;
};

interface SettledResult<T> {
  fetcher: Fetcher<T>;
  attempt: number;
  state: AsyncState<T>;
}

export function useAsyncData<T>(fetcher: Fetcher<T>): AsyncDataResult<T> {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<SettledResult<T> | null>(null);
  const [previousData, setPreviousData] = useState<T | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();
    const settle = (state: AsyncState<T>) => {
      if (!controller.signal.aborted) setSettled({ fetcher, attempt, state });
    };

    fetcher(controller.signal).then(
      (data) => {
        settle({ status: 'success', data });
        if (!controller.signal.aborted) setPreviousData(data);
      },
      (error: unknown) => {
        if (!isAbortError(error)) settle({ status: 'error', error });
      },
    );
    return () => controller.abort();
  }, [fetcher, attempt]);

  const reload = useCallback(() => setAttempt((value) => value + 1), []);
  const isCurrent = settled?.fetcher === fetcher && settled.attempt === attempt;
  const state: AsyncState<T> = isCurrent ? settled.state : { status: 'loading' };

  return { ...state, reload, previousData };
}
