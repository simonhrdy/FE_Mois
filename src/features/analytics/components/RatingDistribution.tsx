import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

import { formatNumber } from '@/lib/utils/format';

const PERCENT = 100;
const STARS_DESCENDING = [5, 4, 3, 2, 1] as const;

export function RatingDistribution({ distribution }: { distribution: readonly number[] }) {
  const total = distribution.reduce((sum, count) => sum + count, 0);

  return (
    <dl className="m-0 flex flex-col gap-2">
      {STARS_DESCENDING.map((stars) => {
        const count = distribution[stars - 1] ?? 0;
        const share = total > 0 ? (count / total) * PERCENT : 0;
        return (
          <div key={stars} className="grid grid-cols-[2.5rem_1fr_3rem] items-center gap-3">
            <Typography component="dt" variant="body2">
              {stars} ★
            </Typography>
            <dd className="m-0">
              <LinearProgress
                variant="determinate"
                value={share}
                color={stars <= 2 ? 'error' : 'primary'}
                aria-label={`${stars} hvězdičky: ${formatNumber(count)} recenzí`}
                sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover' }}
              />
            </dd>
            <Typography
              component="dd"
              variant="body2"
              color="text.secondary"
              className="m-0 text-right"
            >
              {formatNumber(count)}
            </Typography>
          </div>
        );
      })}
    </dl>
  );
}
