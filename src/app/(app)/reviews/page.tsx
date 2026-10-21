import type { Metadata } from 'next';
import { Suspense } from 'react';

import { PageLoader } from '@/components/ui/Loading';
import { ReviewsPage } from '@/app/(app)/_modules';

export const metadata: Metadata = { title: 'Recenze' };

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ReviewsPage />
    </Suspense>
  );
}
