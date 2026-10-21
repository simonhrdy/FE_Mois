'use client';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

import { CountUp } from './CountUp';

const iconVariants = cva('flex size-10 shrink-0 items-center justify-center rounded-xl', {
  variants: {
    tone: {
      primary: 'bg-primary/12 text-primary',
      tertiary: 'bg-tertiary/14 text-tertiary',
      secondary: 'bg-secondary/14 text-secondary',
      error: 'bg-error/12 text-error',
    },
  },
  defaultVariants: { tone: 'primary' },
});

const SPARKLINE_HEIGHT = 48;

const TONE_COLORS = {
  primary: 'var(--mui-palette-primary-main)',
  tertiary: 'var(--mui-palette-tertiary-main)',
  secondary: 'var(--mui-palette-secondary-main)',
  error: 'var(--mui-palette-error-main)',
} as const;

type MetricCardProps = VariantProps<typeof iconVariants> & {
  label: string;
  value: number | null;
  format: (value: number) => string;
  icon: ReactNode;

  badge?: ReactNode;

  trend?: readonly (number | null)[];
  className?: string;
};

export function MetricCard({
  label,
  value,
  format,
  icon,
  badge,
  trend,
  tone,
  className,
}: MetricCardProps) {
  const resolvedTone = tone ?? 'primary';
  return (
    <Card component="section" aria-label={label} className={cn('flex h-full flex-col', className)}>
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <div className="flex min-w-0 flex-col gap-1">
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h4" component="p" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {value === null ? '—' : <CountUp value={value} format={format} />}
          </Typography>
        </div>
        <span aria-hidden className={iconVariants({ tone })}>
          {icon}
        </span>
      </div>
      {badge && <div className="flex flex-wrap items-center gap-1 px-5 pt-1">{badge}</div>}
      <div className="mt-auto px-1 pt-2" aria-hidden>
        {trend && trend.length > 1 ? (
          <SparkLineChart
            data={trend.map((item) => item ?? 0)}
            height={SPARKLINE_HEIGHT}
            curve="natural"
            area
            color={TONE_COLORS[resolvedTone]}
            sx={{
              '& .MuiLineChart-area': { fillOpacity: 0.16 },
              '& .MuiLineChart-line': { strokeWidth: 2 },
            }}
          />
        ) : (
          <div className="h-3" />
        )}
      </div>
    </Card>
  );
}
