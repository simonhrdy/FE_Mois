'use client';

import { LineChart } from '@mui/x-charts/LineChart';
import { useId } from 'react';

import { formatMonth, formatRating } from '@/lib/utils/format';

import type { RatingPoint } from '../types/stats.types';

const CHART_HEIGHT = 280;

interface AreaTrendChartProps {
  label: string;
  points: readonly RatingPoint[];

  benchmark?: { label: string; points: readonly RatingPoint[] };
  height?: number;
}

export function AreaTrendChart({
  label,
  points,
  benchmark,
  height = CHART_HEIGHT,
}: AreaTrendChartProps) {
  const gradientId = useId().replace(/:/g, '');

  return (
    <figure className="m-0" aria-label={`Vývoj hodnocení: ${label}`}>
      <LineChart
        height={height}
        grid={{ horizontal: true }}
        xAxis={[
          {
            scaleType: 'point',
            data: points.map((point) => point.period),
            valueFormatter: formatMonth,
          },
        ]}
        yAxis={[{ min: 1, max: 5, tickNumber: 5 }]}
        series={[
          {
            id: 'own',
            label,
            data: points.map((point) => point.averageRating),
            area: true,
            baseline: 'min',
            curve: 'natural',
            connectNulls: true,
            showMark: false,
            color: 'var(--mui-palette-primary-main)',
            valueFormatter: (value: number | null) => `${formatRating(value)} ★`,
          },
          ...(benchmark
            ? [
                {
                  id: 'benchmark',
                  label: benchmark.label,
                  data: benchmark.points.map((point) => point.averageRating),
                  curve: 'natural' as const,
                  connectNulls: true,
                  showMark: false,
                  color: 'var(--mui-palette-tertiary-main)',
                  valueFormatter: (value: number | null) => `${formatRating(value)} ★`,
                },
              ]
            : []),
        ]}
        sx={{
          '& .MuiLineChart-area': { fill: `url(#${gradientId})` },
          '& .MuiLineChart-line': { strokeWidth: 2.5 },
          '& .MuiChartsGrid-line': { strokeDasharray: '4 4', opacity: 0.6 },
        }}
        margin={{ left: 0, right: 12 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0%"
              style={{ stopColor: 'var(--mui-palette-primary-main)', stopOpacity: 0.35 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: 'var(--mui-palette-primary-main)', stopOpacity: 0 }}
            />
          </linearGradient>
        </defs>
      </LineChart>
    </figure>
  );
}
