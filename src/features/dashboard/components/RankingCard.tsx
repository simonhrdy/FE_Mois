import EmojiEventsRounded from '@mui/icons-material/EmojiEventsRounded';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';

import { cn } from '@/lib/utils/cn';
import { routes } from '@/lib/config/routes';
import { formatNumber, formatRating } from '@/lib/utils/format';

import type { CompetitionSummary } from '../services/dashboard.service';

const MEDAL_COLORS = ['text-[#E8B10E]', 'text-[#A3A9B8]', 'text-[#C27B48]'] as const;
const VISIBLE_ENTRIES = 6;
const MAX_STARS = 5;
const PERCENT = 100;

interface RankingCardProps {
  competition: CompetitionSummary;
  category: string;
  city: string;
}

export function RankingCard({ competition, category, city }: RankingCardProps) {
  const ownIndex = competition.ranking.findIndex((entry) => entry.isOwn);
  const visible = competition.ranking.slice(0, Math.max(VISIBLE_ENTRIES, ownIndex + 1));

  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title="Žebříček v okolí"
        subheader={`${category} · ${city} · průměr ${formatRating(competition.averageRating)} ★`}
        action={
          <Typography variant="h5" component="p" color="primary" className="pt-1 pr-2">
            {competition.rank}./{competition.total}
          </Typography>
        }
      />
      <CardContent className="flex flex-1 flex-col gap-1">
        <ol className="m-0 flex list-none flex-col gap-1 p-0">
          {visible.map((entry, index) => (
            <li
              key={entry.id}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2',
                entry.isOwn && 'bg-primary/10 ring-1 ring-primary/30',
              )}
              aria-current={entry.isOwn ? 'true' : undefined}
            >
              <span className="flex w-6 justify-center" aria-label={`${index + 1}. místo`}>
                {index < MEDAL_COLORS.length ? (
                  <EmojiEventsRounded fontSize="small" className={MEDAL_COLORS[index]} />
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    {index + 1}
                  </Typography>
                )}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                {entry.isOwn ? (
                  <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                    {entry.name} (vy)
                  </Typography>
                ) : (
                  <Link
                    component={NextLink}
                    href={routes.business(entry.id)}
                    underline="hover"
                    variant="body2"
                    noWrap
                  >
                    {entry.name}
                  </Link>
                )}
                <span className="mt-1 h-1.5 overflow-hidden rounded-full bg-container" aria-hidden>
                  <span
                    className={cn(
                      'block h-full rounded-full',
                      entry.isOwn ? 'bg-primary' : 'bg-muted/40',
                    )}
                    style={{ width: `${(entry.stars / MAX_STARS) * PERCENT}%` }}
                  />
                </span>
              </span>
              <span className="flex flex-col items-end">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatRating(entry.stars)} ★
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatNumber(entry.reviewCount)}
                </Typography>
              </span>
            </li>
          ))}
        </ol>
        <Button component={NextLink} href={routes.competitors} className="mt-auto self-start">
          Prozkoumat konkurenci
        </Button>
      </CardContent>
    </Card>
  );
}
