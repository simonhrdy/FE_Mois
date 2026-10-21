'use client';

import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

import { useCountUp } from '@/lib/hooks/use-count-up';

import type { ReputationScore } from '../types/insight.types';
import { LEVEL_PRESENTATION } from '../utils/topic-presentation';

const GAUGE_SIZE = 200;
const ARC_ANGLE = 115;

export function ReputationGauge({ score }: { score: ReputationScore }) {
  const level = LEVEL_PRESENTATION[score.level];
  const animated = useCountUp(score.score);

  return (
    <div
      className="flex flex-col items-center"
      role="img"
      aria-label={`Skóre reputace ${score.score} ze 100, ${level.label}`}
    >
      <Gauge
        width={GAUGE_SIZE}
        height={GAUGE_SIZE * 0.72}
        value={animated}
        valueMax={100}
        startAngle={-ARC_ANGLE}
        endAngle={ARC_ANGLE}
        innerRadius="78%"
        outerRadius="100%"
        cornerRadius="50%"
        text={() => String(Math.round(animated))}
        aria-hidden
        sx={{
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: 44,
            fontWeight: 700,
            transform: 'translateY(6px)',
          },
          [`& .${gaugeClasses.valueText} text`]: { fill: 'var(--mui-palette-text-primary)' },
          [`& .${gaugeClasses.valueArc}`]: { fill: `var(--mui-palette-${level.color}-main)` },
          [`& .${gaugeClasses.referenceArc}`]: { fill: 'var(--mui-palette-surfaceContainerHigh)' },
        }}
      />
      <Typography variant="caption" color="text.secondary" className="-mt-2">
        Skóre reputace
      </Typography>
      <Chip size="small" color={level.color} label={level.label} className="mt-1" />
    </div>
  );
}
