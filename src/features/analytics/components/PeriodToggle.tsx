'use client';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { ANALYTICS_PERIODS } from '../schemas/stats.schema';
import type { AnalyticsPeriod } from '../types/stats.types';

interface PeriodToggleProps {
  value: AnalyticsPeriod;
  onChange: (value: AnalyticsPeriod) => void;
}

export function PeriodToggle({ value, onChange }: PeriodToggleProps) {
  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={value}
      aria-label="Sledované období"
      onChange={(_event, next: AnalyticsPeriod | null) => {
        if (next !== null) onChange(next);
      }}
    >
      {ANALYTICS_PERIODS.map((period) => (
        <ToggleButton key={period} value={period}>
          {period} měs.
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
