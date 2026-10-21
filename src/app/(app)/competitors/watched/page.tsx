import type { Metadata } from 'next';
import { Suspense } from 'react';

import { PageLoader } from '@/components/ui/Loading';
import { WatchedCompetitorsPage } from '@/app/(app)/_modules';

export const metadata: Metadata = { title: 'Moje konkurence' };

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <WatchedCompetitorsPage />
    </Suspense>
  );
}
