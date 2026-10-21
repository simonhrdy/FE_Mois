import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { authSlice } from './slices/auth.slice';
import { notificationsSlice } from './slices/notifications.slice';
import { uiSlice } from './slices/ui.slice';
import { workspaceSlice } from './slices/workspace.slice';

const rootReducer = combineSlices(authSlice, workspaceSlice, uiSlice, notificationsSlice);

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({ reducer: rootReducer, preloadedState });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
