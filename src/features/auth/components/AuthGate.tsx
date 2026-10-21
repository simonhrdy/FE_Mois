'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { PageLoader } from '@/components/ui/Loading';
import { routes } from '@/lib/config/routes';

import { useSessionRestore } from '../hooks/use-session-restore';

export function AuthGate({ children }: { children: ReactNode }) {
  const status = useSessionRestore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'anonymous') router.replace(routes.loginWithReturn(pathname));
  }, [pathname, router, status]);

  if (status !== 'authenticated') return <PageLoader label="Ověřování přihlášení…" />;
  return children;
}
