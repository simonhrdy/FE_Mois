'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { routes } from '@/lib/config/routes';
import { useAppDispatch } from '@/store/hooks';
import { sessionEnded, sessionStarted } from '@/store/slices/auth.slice';

import { authService } from '../services/auth.service';
import type { LoginInput } from '../types/auth.types';

export function useLogin() {
  const dispatch = useAppDispatch();
  return useCallback(
    async (input: LoginInput) => {
      const user = await authService.login(input);
      dispatch(sessionStarted(user));
    },
    [dispatch],
  );
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  return useCallback(() => {
    authService.logout();
    dispatch(sessionEnded());
    router.replace(routes.login);
  }, [dispatch, router]);
}
