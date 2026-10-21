'use client';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Tooltip from '@mui/material/Tooltip';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import { isNavItemActive, type NavGroup } from './nav-items';

interface NavListProps {
  groups: readonly NavGroup[];
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function NavList({ groups, collapsed = false, onNavigate }: NavListProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2 px-3">
      {groups.map((group) => (
        <List
          key={group.title}
          dense
          disablePadding
          aria-label={group.title}
          subheader={
            collapsed ? undefined : (
              <ListSubheader
                disableSticky
                sx={{ bgcolor: 'transparent', lineHeight: '32px', px: 2, fontWeight: 600 }}
              >
                {group.title}
              </ListSubheader>
            )
          }
        >
          {group.items.map((item) => {
            const { label, href, icon: Icon } = item;
            const active = isNavItemActive(pathname, item);
            return (
              <li key={href}>
                <Tooltip title={collapsed ? label : ''} placement="right">
                  <ListItemButton
                    component={NextLink}
                    href={href}
                    selected={active}
                    aria-current={active ? 'page' : undefined}
                    onClick={onNavigate}
                    sx={{ mb: 0.25, py: 1, justifyContent: collapsed ? 'center' : 'initial' }}
                  >
                    <ListItemIcon sx={{ minWidth: collapsed ? 0 : 38, color: 'inherit' }}>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    {collapsed ? (
                      <span className="sr-only">{label}</span>
                    ) : (
                      <ListItemText
                        primary={label}
                        slotProps={{ primary: { sx: { fontWeight: 'inherit' } } }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </li>
            );
          })}
        </List>
      ))}
    </div>
  );
}
