import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { sessionEnded, sessionStarted } from './auth.slice';

export interface WorkspaceState {
  activeBusinessId: string | null;
}

const initialState: WorkspaceState = { activeBusinessId: null };

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    activeBusinessChanged: (state, action: PayloadAction<string>) => {
      state.activeBusinessId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sessionStarted, (state, action) => {
        const owned = action.payload.businesses.map((business) => business.id);
        if (!state.activeBusinessId || !owned.includes(state.activeBusinessId)) {
          state.activeBusinessId = owned[0] ?? null;
        }
      })
      .addCase(sessionEnded, (state) => {
        state.activeBusinessId = null;
      });
  },
  selectors: {
    selectActiveBusinessId: (state) => state.activeBusinessId,
  },
});

export const { activeBusinessChanged } = workspaceSlice.actions;
export const { selectActiveBusinessId } = workspaceSlice.selectors;
