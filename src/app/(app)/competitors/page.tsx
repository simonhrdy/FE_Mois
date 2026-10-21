import type { Metadata } from 'next';
import { Suspense } from 'react';

import { PageLoader } from '@/components/ui/Loading';
import { CompetitorsPage } from '@/app/(app)/_modules';

export const metadata: Metadata = { title: 'Konkurence' };

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <CompetitorsPage />
    </Suspense>
  );
}
