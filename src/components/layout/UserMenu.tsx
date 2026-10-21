'use client';

import Logout from '@mui/icons-material/Logout';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { useId, useState } from 'react';

import { useLogout } from '@/features/auth/hooks/use-auth';
import { routes } from '@/lib/config/routes';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/slices/auth.slice';

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function UserMenu() {
  const user = useAppSelector(selectCurrentUser);
  const logout = useLogout();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const menuId = useId();
  const open = Boolean(anchor);
  const close = () => setAnchor(null);

  if (!user) return null;

  return (
    <>
      <Tooltip title="Účet">
        <IconButton
          aria-label="Otevřít menu účtu"
          aria-controls={open ? menuId : undefined}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={(event) => setAnchor(event.currentTarget)}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>
            {initials(user.name)}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        id={menuId}
        anchorEl={anchor}
        open={open}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <div className="px-4 py-2">
          <Typography variant="subtitle2">{user.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {user.email}
          </Typography>
        </div>
        <Divider />
        <MenuItem component={NextLink} href={routes.settings} onClick={close}>
          <ListItemIcon>
            <SettingsOutlined fontSize="small" />
          </ListItemIcon>
          Nastavení
        </MenuItem>
        <MenuItem
          onClick={() => {
            close();
            logout();
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Odhlásit se
        </MenuItem>
      </Menu>
    </>
  );
}
