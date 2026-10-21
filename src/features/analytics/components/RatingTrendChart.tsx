'use client';

import { LineChart } from '@mui/x-charts/LineChart';

import { formatMonth, formatRating } from '@/lib/utils/format';

import type { RatingPoint } from '../types/stats.types';

const CHART_HEIGHT = 300;
const Y_MIN = 1;
const Y_MAX = 5;

export interface RatingSeries {
  label: string;
  points: readonly RatingPoint[];

  secondary?: boolean;
}

interface RatingTrendChartProps {
  series: readonly RatingSeries[];
  height?: number;
}

export function RatingTrendChart({ series, height = CHART_HEIGHT }: RatingTrendChartProps) {
  const periods = series[0]?.points.map((point) => point.period) ?? [];

  return (
    <figure className="m-0" aria-label="Vývoj průměrného hodnocení po měsících">
      <LineChart
        height={height}
        xAxis={[{ scaleType: 'point', data: periods, valueFormatter: formatMonth }]}
        yAxis={[{ min: Y_MIN, max: Y_MAX, tickNumber: 5 }]}
        series={series.map((item) => ({
          id: item.label,
          label: item.label,
          data: item.points.map((point) => point.averageRating),
          connectNulls: true,
          showMark: !item.secondary,
          valueFormatter: (value: number | null) => `${formatRating(value)} ★`,
        }))}
        margin={{ left: 0, right: 16 }}
      />
    </figure>
  );
}
