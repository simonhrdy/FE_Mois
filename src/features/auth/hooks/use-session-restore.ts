'use client';

import { useEffect } from 'react';

import { isAbortError } from '@/lib/api/errors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectAuthStatus, sessionEnded, sessionStarted } from '@/store/slices/auth.slice';

import { authService } from '../services/auth.service';

export function useSessionRestore() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);

  useEffect(() => {
    if (status !== 'unknown') return;
    const controller = new AbortController();
    authService.restore(controller.signal).then(
      (user) => dispatch(user ? sessionStarted(user) : sessionEnded()),
      (error: unknown) => {
        if (!isAbortError(error)) dispatch(sessionEnded());
      },
    );
    return () => controller.abort();
  }, [dispatch, status]);

  return status;
}
