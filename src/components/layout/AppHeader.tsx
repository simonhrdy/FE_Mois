'use client';

import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SearchRounded from '@mui/icons-material/SearchRounded';
import AppBar from '@mui/material/AppBar';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';

import { ColorModeToggle } from '@/components/shared/ColorModeToggle';
import { BusinessSwitcher } from '@/features/businesses/components/BusinessSwitcher';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  commandPaletteToggled,
  selectMobileNavOpen,
  selectSidebarCollapsed,
  toggleMobileNav,
  toggleSidebarCollapsed,
} from '@/store/slices/ui.slice';

import { UserMenu } from './UserMenu';

export function AppHeader() {
  const dispatch = useAppDispatch();
  const mobileNavOpen = useAppSelector(selectMobileNavOpen);
  const collapsed = useAppSelector(selectSidebarCollapsed);
  const collapseLabel = collapsed ? 'Rozbalit navigaci' : 'Sbalit navigaci';

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar className="gap-2" sx={{ minHeight: { xs: 64, md: 64 } }}>
        <IconButton
          edge="start"
          aria-label="Otevřít navigaci"
          aria-expanded={mobileNavOpen}
          onClick={() => dispatch(toggleMobileNav())}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Tooltip title={collapseLabel}>
          <IconButton
            edge="start"
            aria-label={collapseLabel}
            onClick={() => dispatch(toggleSidebarCollapsed())}
            sx={{ display: { xs: 'none', md: 'inline-flex' } }}
          >
            {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
          </IconButton>
        </Tooltip>
        <BusinessSwitcher />
        <div className="flex flex-1 justify-center px-2">
          <ButtonBase
            onClick={() => dispatch(commandPaletteToggled(true))}
            aria-label="Přejít na stránku (Ctrl+K)"
            className="hidden w-full max-w-md items-center gap-2 rounded-lg bg-container px-4 py-2.5 text-muted transition-colors hover:bg-container-high sm:flex"
          >
            <SearchRounded fontSize="small" />
            <span className="flex-1 text-left text-sm">Přejít na stránku…</span>
            <kbd className="rounded-md border border-divider bg-surface px-1.5 text-xs">⌘K</kbd>
          </ButtonBase>
        </div>
        <Tooltip title="Hledat (⌘K)">
          <IconButton
            aria-label="Hledat"
            onClick={() => dispatch(commandPaletteToggled(true))}
            sx={{ display: { sm: 'none' } }}
          >
            <SearchRounded />
          </IconButton>
        </Tooltip>
        <ColorModeToggle />
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
}
