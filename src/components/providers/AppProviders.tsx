'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import type { ReactNode } from 'react';

import { GlobalSnackbar } from '@/components/shared/GlobalSnackbar';
import { StoreProvider } from '@/store/provider';
import { theme } from '@/theme/theme';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme} defaultMode="light" modeStorageKey="yelp-color-mode">
        <CssBaseline enableColorScheme />
        <StoreProvider>
          {children}
          <GlobalSnackbar />
        </StoreProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
