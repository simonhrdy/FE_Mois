import type { Metadata } from 'next';
import { Suspense } from 'react';

import { PageLoader } from '@/components/ui/Loading';
import { LoginView } from '@/features/auth/components/LoginView';

export const metadata: Metadata = { title: 'Přihlášení' };

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LoginView />
    </Suspense>
  );
}
