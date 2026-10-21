import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AssistantPage } from '@/app/(app)/_modules';
import { PageLoader } from '@/components/ui/Loading';

export const metadata: Metadata = { title: 'AI asistent' };

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AssistantPage />
    </Suspense>
  );
}
