import TrendingDown from '@mui/icons-material/TrendingDown';
import TrendingFlat from '@mui/icons-material/TrendingFlat';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Chip, { type ChipProps } from '@mui/material/Chip';
import type { ReactElement } from 'react';

import type { TrendDirection } from '@/features/competitors/types/competitor.types';

const PRESENTATION: Record<
  TrendDirection,
  { icon?: ReactElement; color: NonNullable<ChipProps['color']>; label: string }
> = {
  up: { icon: <TrendingUp />, color: 'success', label: 'Roste' },
  down: { icon: <TrendingDown />, color: 'error', label: 'Klesá' },
  flat: { icon: <TrendingFlat />, color: 'default', label: 'Stabilní' },
  unknown: { color: 'default', label: 'Nedostatek dat' },
};

interface TrendChipProps {
  direction: TrendDirection;

  label?: string;
}

export function TrendChip({ direction, label }: TrendChipProps) {
  const presentation = PRESENTATION[direction];
  return (
    <Chip
      size="small"
      variant="outlined"
      color={presentation.color}
      icon={presentation.icon}
      label={label ?? presentation.label}
    />
  );
}
