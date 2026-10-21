import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';

import { ScoreFactors } from '@/features/insights/components/ScoreFactors';
import { RECENT_PERIOD_DAYS } from '@/lib/config/app';
import { routes } from '@/lib/config/routes';
import { formatRating } from '@/lib/utils/format';

import type { DashboardOverview } from '../services/dashboard.service';

const DECLINE_ALERT_THRESHOLD = 0.3;

export function DashboardHero({ overview }: { overview: DashboardOverview }) {
  const { business, score } = overview;
  const drop = overview.recentRatingChange ?? 0;

  return (
    <Card>
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <Typography variant="body2" color="text.secondary">
              Přehled podniku
            </Typography>
            <Typography variant="h4" component="h1">
              {business.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" className="flex items-center gap-1">
              <PlaceOutlined fontSize="inherit" aria-hidden />
              {business.address}, {business.city}
            </Typography>
          </div>
          <div className="rounded-lg bg-container px-5 py-3">
            <Typography variant="caption" color="text.secondary">
              Skóre reputace
            </Typography>
            <Typography variant="h5" component="p">
              {score.score}
              <Typography component="span" variant="body2" color="text.secondary">
                {' '}
                / 100
              </Typography>
            </Typography>
          </div>
        </div>
        {drop <= -DECLINE_ALERT_THRESHOLD && (
          <div
            role="alert"
            className="flex flex-wrap items-center gap-2 rounded-lg bg-warning/10 px-3 py-2"
          >
            <WarningAmberRounded color="warning" fontSize="small" aria-hidden />
            <Typography variant="body2" className="flex-1">
              Za posledních {RECENT_PERIOD_DAYS} dní hodnocení kleslo o{' '}
              <strong>{formatRating(Math.abs(drop))} ★</strong>.
            </Typography>
            <Button
              size="small"
              color="warning"
              component={NextLink}
              href={`${routes.reviews}?maxStars=2`}
            >
              Zobrazit recenze
            </Button>
          </div>
        )}
        <details className="text-sm">
          <summary className="cursor-pointer text-muted">Jak se počítá skóre reputace</summary>
          <div className="mt-4 max-w-lg">
            <ScoreFactors factors={score.factors} />
          </div>
        </details>
      </div>
    </Card>
  );
}
