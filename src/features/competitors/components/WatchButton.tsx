'use client';

import Bookmark from '@mui/icons-material/Bookmark';
import BookmarkBorder from '@mui/icons-material/BookmarkBorder';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

interface WatchButtonProps {
  watched: boolean;
  pending?: boolean;
  disabled?: boolean;
  onClick: () => void;
  size?: 'small' | 'medium';
}

export function WatchButton({
  watched,
  pending,
  disabled,
  onClick,
  size = 'small',
}: WatchButtonProps) {
  const icon = pending ? (
    <CircularProgress size={16} color="inherit" />
  ) : watched ? (
    <Bookmark />
  ) : (
    <BookmarkBorder />
  );

  return (
    <Button
      size={size}
      variant={watched ? 'contained' : 'outlined'}
      startIcon={icon}
      aria-pressed={watched}
      disabled={pending || disabled}
      onClick={onClick}
      sx={{ whiteSpace: 'nowrap' }}
    >
      {watched ? 'Sledováno' : 'Sledovat'}
    </Button>
  );
}
