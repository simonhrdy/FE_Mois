'use client';

import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import NextLink from 'next/link';

import { AppTable, type TableColumn } from '@/components/ui/AppTable';
import { RatingValue } from '@/components/ui/RatingValue';
import { TrendChip } from '@/components/ui/TrendChip';
import { routes } from '@/lib/config/routes';
import { formatNumber, formatPercent, formatRatingDelta } from '@/lib/utils/format';

import type { ComparisonRow } from '../types/competitor.types';

import { WatchButton } from './WatchButton';

interface ComparisonTableProps {
  rows: readonly ComparisonRow[];
  pendingId?: string | null;
  onUnwatch?: (row: ComparisonRow) => void;
}

export function ComparisonTable({ rows, pendingId, onUnwatch }: ComparisonTableProps) {
  const columns: TableColumn<ComparisonRow>[] = [
    {
      id: 'name',
      header: 'Podnik',
      isRowHeader: true,
      render: ({ business, isOwn }) =>
        isOwn ? (
          <span className="inline-flex flex-wrap items-center gap-2">
            <strong>{business.name}</strong>
            <Chip size="small" color="primary" label="Váš podnik" />
          </span>
        ) : (
          <Link component={NextLink} href={routes.business(business.id)} underline="hover">
            {business.name}
          </Link>
        ),
    },
    {
      id: 'rating',
      header: 'Hodnocení v období',
      render: ({ stats }) => <RatingValue value={stats.averageRating} />,
    },
    {
      id: 'delta',
      header: 'Oproti vám',
      align: 'right',
      render: ({ ratingDelta, isOwn }) => (isOwn ? '—' : formatRatingDelta(ratingDelta)),
    },
    {
      id: 'reviews',
      header: 'Recenzí',
      align: 'right',
      hideBelow: 'sm',
      render: ({ stats }) => formatNumber(stats.reviewCount),
    },
    {
      id: 'negative',
      header: 'Negativních',
      align: 'right',
      hideBelow: 'md',
      render: ({ negativeShare }) => formatPercent(negativeShare),
    },
    {
      id: 'trend',
      header: 'Trend',
      hideBelow: 'md',
      render: ({ trend }) => <TrendChip direction={trend} />,
    },
  ];

  if (onUnwatch) {
    columns.push({
      id: 'action',
      header: 'Akce',
      align: 'right',
      render: (row) =>
        row.isOwn ? null : (
          <WatchButton
            watched
            pending={pendingId === row.business.id}
            onClick={() => onUnwatch(row)}
          />
        ),
    });
  }

  return (
    <AppTable
      caption="Porovnání s konkurencí"
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.business.id}
    />
  );
}
