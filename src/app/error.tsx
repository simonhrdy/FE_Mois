'use client';

import { useEffect } from 'react';

import { ErrorState } from '@/components/ui/ErrorState';

interface ErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <ErrorState error={error} title="Něco se pokazilo" onRetry={retry} />
    </div>
  );
}
