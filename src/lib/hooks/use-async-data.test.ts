import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAsyncData } from './use-async-data';

describe('useAsyncData', () => {
  it('transitions from loading to success', async () => {
    const fetcher = vi.fn().mockResolvedValue(42);
    const { result } = renderHook(() => useAsyncData(fetcher));

    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current).toMatchObject({ status: 'success', data: 42 }));
  });

  it('exposes errors and retries on reload', async () => {
    const fetcher = vi.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce('ok');
    const { result } = renderHook(() => useAsyncData(fetcher));

    await waitFor(() => expect(result.current.status).toBe('error'));
    act(() => result.current.reload());
    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current).toMatchObject({ status: 'success', data: 'ok' }));
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('aborts the previous request when the fetcher changes', async () => {
    const signals: AbortSignal[] = [];
    const makeFetcher = (value: string) => (signal: AbortSignal) => {
      signals.push(signal);
      return Promise.resolve(value);
    };
    const { result, rerender } = renderHook(({ fetcher }) => useAsyncData(fetcher), {
      initialProps: { fetcher: makeFetcher('first') },
    });

    rerender({ fetcher: makeFetcher('second') });

    expect(signals[0]?.aborted).toBe(true);
    await waitFor(() =>
      expect(result.current).toMatchObject({ status: 'success', data: 'second' }),
    );
  });
});
