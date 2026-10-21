import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  mobileNavOpen: boolean;
  sidebarCollapsed: boolean;

  commandPaletteOpen: boolean;
}

const initialState: UiState = {
  mobileNavOpen: false,
  sidebarCollapsed: false,
  commandPaletteOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileNav: (state) => {
      state.mobileNavOpen = !state.mobileNavOpen;
    },
    closeMobileNav: (state) => {
      state.mobileNavOpen = false;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    commandPaletteToggled: (state, action: PayloadAction<boolean | undefined>) => {
      state.commandPaletteOpen = action.payload ?? !state.commandPaletteOpen;
    },
  },
  selectors: {
    selectMobileNavOpen: (state) => state.mobileNavOpen,
    selectSidebarCollapsed: (state) => state.sidebarCollapsed,
    selectCommandPaletteOpen: (state) => state.commandPaletteOpen,
  },
});

export const { toggleMobileNav, closeMobileNav, toggleSidebarCollapsed, commandPaletteToggled } =
  uiSlice.actions;
export const { selectMobileNavOpen, selectSidebarCollapsed, selectCommandPaletteOpen } =
  uiSlice.selectors;
