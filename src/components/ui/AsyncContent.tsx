import LinearProgress from '@mui/material/LinearProgress';
import type { ReactNode } from 'react';

import type { AsyncDataResult } from '@/lib/hooks/use-async-data';

import { ErrorState } from './ErrorState';

interface AsyncContentProps<T> {
  result: AsyncDataResult<T>;
  loading: ReactNode;

  empty?: ReactNode;
  isEmpty?: (data: T) => boolean;
  errorTitle?: string;
  children: (data: T) => ReactNode;
}

export function AsyncContent<T>({
  result,
  loading,
  empty,
  isEmpty,
  errorTitle,
  children,
}: AsyncContentProps<T>) {
  const render = (data: T) => (empty && isEmpty?.(data) ? empty : children(data));

  if (result.status === 'loading') {
    if (result.previousData === undefined) return loading;
    return (
      <>
        <LinearProgress aria-label="Aktualizace dat" />
        {render(result.previousData)}
      </>
    );
  }
  if (result.status === 'error') {
    return <ErrorState error={result.error} title={errorTitle} onRetry={result.reload} />;
  }
  return render(result.data);
}
