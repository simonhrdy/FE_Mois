'use client';

import Drawer from '@mui/material/Drawer';

import { NavList } from '@/components/navigation/NavList';
import { navGroups } from '@/components/navigation/nav-items';
import { routes } from '@/lib/config/routes';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  closeMobileNav,
  selectMobileNavOpen,
  selectSidebarCollapsed,
} from '@/store/slices/ui.slice';

import { AppLogo } from './AppLogo';
import { DRAWER_COLLAPSED_WIDTH, DRAWER_WIDTH } from './layout.constants';

function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Hlavní navigace" className="flex h-full flex-col gap-4 py-4">
      <div className={collapsed ? 'flex justify-center' : 'px-5'}>
        <AppLogo href={routes.dashboard} compact={collapsed} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <NavList groups={navGroups} collapsed={collapsed} onNavigate={onNavigate} />
      </div>
    </nav>
  );
}

const paperSx = {
  borderRight: 1,
  borderColor: 'divider',
  bgcolor: 'background.paper',
  backgroundImage: 'none',
} as const;

export function AppSidebar() {
  const dispatch = useAppDispatch();
  const mobileOpen = useAppSelector(selectMobileNavOpen);
  const collapsed = useAppSelector(selectSidebarCollapsed);
  const desktopWidth = collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;
  const handleClose = () => dispatch(closeMobileNav());

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, ...paperSx },
        }}
      >
        <SidebarContent collapsed={false} onNavigate={handleClose} />
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          width: desktopWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: desktopWidth,
            overflowX: 'hidden',
            transition: (theme) => theme.transitions.create('width'),
            ...paperSx,
          },
        }}
      >
        <SidebarContent collapsed={collapsed} />
      </Drawer>
    </>
  );
}
