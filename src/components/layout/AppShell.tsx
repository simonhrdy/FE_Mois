import Box from '@mui/material/Box';
import type { ReactNode } from 'react';

import { AppHeader } from './AppHeader';
import { CommandPalette } from './CommandPalette';
import { AppSidebar } from './AppSidebar';

const MAIN_CONTENT_ID = 'main-content';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only z-[1300] rounded bg-surface px-4 py-2 text-primary focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Přeskočit na obsah
      </a>
      <AppSidebar />
      <CommandPalette />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <Box
          component="main"
          id={MAIN_CONTENT_ID}
          tabIndex={-1}
          sx={{ flex: 1, px: { xs: 2, sm: 3, lg: 5 }, py: { xs: 3, md: 4 }, outline: 'none' }}
        >
          {children}
        </Box>
      </div>
    </div>
  );
}
