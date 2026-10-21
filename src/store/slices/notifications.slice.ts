import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type { Severity } from '@/types/common';

export interface Notification {
  id: string;
  message: string;
  severity: Severity;
}

export interface NotificationsState {
  current: Notification | null;
}

const initialState: NotificationsState = { current: null };

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    showNotification: {
      reducer: (state, action: PayloadAction<Notification>) => {
        state.current = action.payload;
      },
      prepare: (message: string, severity: Severity = 'success') => ({
        payload: { id: nanoid(), message, severity },
      }),
    },
    dismissNotification: (state, action: PayloadAction<string>) => {
      if (state.current?.id === action.payload) state.current = null;
    },
  },
  selectors: {
    selectCurrentNotification: (state) => state.current,
  },
});

export const { showNotification, dismissNotification } = notificationsSlice.actions;
export const { selectCurrentNotification } = notificationsSlice.selectors;
