'use client';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { AppLogo } from '@/components/layout/AppLogo';
import { env } from '@/lib/config/env';
import { routes } from '@/lib/config/routes';
import { DEMO_ACCOUNT } from '@/mocks/mock-users';
import { useAppSelector } from '@/store/hooks';
import { selectAuthStatus } from '@/store/slices/auth.slice';

import { useLogin } from '../hooks/use-auth';
import { useSessionRestore } from '../hooks/use-session-restore';
import { LoginForm } from './LoginForm';

const demoCredentials = env.apiMocking
  ? { email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password }
  : undefined;

function safeReturnPath(value: string | null): string {
  return value?.startsWith('/') && !value.startsWith('//') ? value : routes.dashboard;
}

export function LoginView() {
  useSessionRestore();
  const status = useAppSelector(selectAuthStatus);
  const login = useLogin();
  const router = useRouter();
  const returnPath = safeReturnPath(useSearchParams().get('next'));

  useEffect(() => {
    if (status === 'authenticated') router.replace(returnPath);
  }, [returnPath, router, status]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-5 py-12">
      <AppLogo href={routes.login} />
      <Card className="w-full max-w-[420px] p-6 sm:p-10">
        <div className="mb-8 flex flex-col gap-2">
          <Typography variant="h4" component="h1">
            Přihlášení
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Přihlaste se ke svému podniku.
          </Typography>
        </div>
        <LoginForm onSubmit={login} demoCredentials={demoCredentials} />
      </Card>
      <Typography variant="caption" color="text.secondary">
        Recenze a hodnocení na jednom místě.
      </Typography>
    </main>
  );
}
