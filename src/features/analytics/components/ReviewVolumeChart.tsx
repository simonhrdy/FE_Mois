'use client';

import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';

import { formatMonth } from '@/lib/utils/format';

import type { RatingPoint } from '../types/stats.types';

const CHART_HEIGHT = 280;

export function ReviewVolumeChart({ points }: { points: readonly RatingPoint[] }) {
  const theme = useTheme();

  return (
    <figure className="m-0" aria-label="Počet recenzí po měsících">
      <BarChart
        height={CHART_HEIGHT}
        xAxis={[
          {
            scaleType: 'band',
            data: points.map((point) => point.period),
            valueFormatter: formatMonth,
          },
        ]}
        series={[
          {
            id: 'negative',
            label: 'Negativní (1–2★)',
            data: points.map((point) => point.negativeCount),
            stack: 'reviews',
            color: theme.palette.error.main,
          },
          {
            id: 'other',
            label: 'Ostatní (3–5★)',
            data: points.map((point) => point.reviewCount - point.negativeCount),
            stack: 'reviews',
            color: theme.palette.primary.main,
          },
        ]}
        margin={{ left: 0, right: 16 }}
      />
    </figure>
  );
}
