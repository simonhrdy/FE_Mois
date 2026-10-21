'use client';

import Alert from '@mui/material/Alert';
import Snackbar, { type SnackbarCloseReason } from '@mui/material/Snackbar';
import type { SyntheticEvent } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { dismissNotification, selectCurrentNotification } from '@/store/slices/notifications.slice';

const AUTO_HIDE_MS = 5000;

export function GlobalSnackbar() {
  const dispatch = useAppDispatch();
  const notification = useAppSelector(selectCurrentNotification);

  if (!notification) return null;

  const handleClose = (_event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return;
    dispatch(dismissNotification(notification.id));
  };

  return (
    <Snackbar
      key={notification.id}
      open
      autoHideDuration={AUTO_HIDE_MS}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={notification.severity} variant="filled">
        {notification.message}
      </Alert>
    </Snackbar>
  );
}
