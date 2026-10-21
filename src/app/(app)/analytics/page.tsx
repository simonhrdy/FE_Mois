import type { Metadata } from 'next';
import { Suspense } from 'react';

import { PageLoader } from '@/components/ui/Loading';
import { AnalyticsPage } from '@/app/(app)/_modules';

export const metadata: Metadata = { title: 'Analytika' };

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AnalyticsPage />
    </Suspense>
  );
}
