'use client';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';

import { AppTable, type TableColumn } from '@/components/ui/AppTable';
import { RatingValue } from '@/components/ui/RatingValue';
import { routes } from '@/lib/config/routes';
import { formatDate, formatNumber } from '@/lib/utils/format';

import type { Competitor } from '../types/competitor.types';

import { WatchButton } from './WatchButton';

interface CompetitorsTableProps {
  competitors: readonly Competitor[];
  watchedIds: ReadonlySet<string>;
  pendingId: string | null;
  limitReached: boolean;
  onToggleWatch: (competitor: Competitor) => void;
}

export function CompetitorsTable({
  competitors,
  watchedIds,
  pendingId,
  limitReached,
  onToggleWatch,
}: CompetitorsTableProps) {
  const columns: readonly TableColumn<Competitor>[] = [
    {
      id: 'name',
      header: 'Podnik',
      isRowHeader: true,
      render: (competitor) => (
        <div className="flex min-w-0 flex-col">
          <Link component={NextLink} href={routes.business(competitor.id)} underline="hover">
            {competitor.name}
          </Link>
          <Typography variant="caption" color="text.secondary">
            {competitor.address}
            {competitor.isOpen ? '' : ' · uzavřeno'}
          </Typography>
        </div>
      ),
    },
    {
      id: 'rating',
      header: 'Hodnocení',
      render: (competitor) => <RatingValue value={competitor.stars} />,
    },
    {
      id: 'reviews',
      header: 'Recenzí',
      align: 'right',
      hideBelow: 'sm',
      render: (competitor) => formatNumber(competitor.reviewCount),
    },
    {
      id: 'latest',
      header: 'Nejnovější recenze',
      hideBelow: 'lg',
      render: ({ latestReview }) =>
        latestReview ? (
          <div className="flex max-w-sm flex-col">
            <Typography variant="caption" color="text.secondary">
              {latestReview.stars} ★ · {formatDate(latestReview.date)}
            </Typography>
            <Typography variant="body2" noWrap>
              {latestReview.text}
            </Typography>
          </div>
        ) : (
          '—'
        ),
    },
    {
      id: 'watch',
      header: 'Sledování',
      align: 'right',
      render: (competitor) => {
        const watched = watchedIds.has(competitor.id);
        return (
          <WatchButton
            watched={watched}
            pending={pendingId === competitor.id}
            disabled={!watched && limitReached}
            onClick={() => onToggleWatch(competitor)}
          />
        );
      },
    },
  ];

  return (
    <AppTable
      caption="Konkurenční podniky"
      columns={columns}
      rows={competitors}
      getRowKey={(competitor) => competitor.id}
    />
  );
}
