import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AuthUser } from '@/features/auth/types/auth.types';

export type AuthStatus = 'unknown' | 'authenticated' | 'anonymous';

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
}

const initialState: AuthState = { status: 'unknown', user: null };

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionStarted: (state, action: PayloadAction<AuthUser>) => {
      state.status = 'authenticated';
      state.user = action.payload;
    },
    sessionEnded: (state) => {
      state.status = 'anonymous';
      state.user = null;
    },
  },
  selectors: {
    selectAuthStatus: (state) => state.status,
    selectCurrentUser: (state) => state.user,
  },
});

export const { sessionStarted, sessionEnded } = authSlice.actions;
export const { selectAuthStatus, selectCurrentUser } = authSlice.selectors;
