import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

import type { ScoreFactor } from '../types/insight.types';

const PERCENT = 100;

export function ScoreFactors({ factors }: { factors: readonly ScoreFactor[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
      {factors.map((factor) => (
        <li key={factor.id} className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-2">
            <Typography variant="caption" color="text.secondary">
              {factor.label} · váha {Math.round(factor.weight * PERCENT)} %
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {factor.value}
            </Typography>
          </div>
          <LinearProgress
            variant="determinate"
            value={factor.value}
            aria-label={`${factor.label}: ${factor.value} ze 100`}
            color={factor.value >= 65 ? 'success' : factor.value >= 45 ? 'warning' : 'error'}
            sx={{ height: 6, bgcolor: 'action.hover' }}
          />
        </li>
      ))}
    </ul>
  );
}
