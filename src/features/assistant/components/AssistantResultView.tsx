import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { AppTable, type TableColumn } from '@/components/ui/AppTable';
import { RatingValue } from '@/components/ui/RatingValue';
import { AreaTrendChart } from '@/features/analytics/components/AreaTrendChart';
import { TopicList } from '@/features/insights/components/TopicList';
import { ReviewList } from '@/features/reviews/components/ReviewList';
import { formatNumber, formatPercent } from '@/lib/utils/format';

import type { AssistantResult } from '../types/assistant.types';

type ComparisonEntry = Extract<AssistantResult, { type: 'comparison' }>['rows'][number];

const comparisonColumns: readonly TableColumn<ComparisonEntry>[] = [
  {
    id: 'name',
    header: 'Podnik',
    isRowHeader: true,
    render: (row) => (
      <span className="inline-flex flex-wrap items-center gap-2">
        {row.name}
        {row.isOwn && <Chip size="small" color="primary" label="Vy" />}
      </span>
    ),
  },
  { id: 'rating', header: 'Hodnocení', render: (row) => <RatingValue value={row.averageRating} /> },
  {
    id: 'reviews',
    header: 'Recenzí',
    align: 'right',
    hideBelow: 'sm',
    render: (row) => formatNumber(row.reviewCount),
  },
  {
    id: 'negative',
    header: 'Negativních',
    align: 'right',
    hideBelow: 'sm',
    render: (row) => formatPercent(row.negativeShare),
  },
];

function ResultBody({ result }: { result: AssistantResult }) {
  switch (result.type) {
    case 'reviews':
      return <ReviewList reviews={result.reviews} />;
    case 'comparison':
      return (
        <AppTable
          caption={result.title}
          columns={comparisonColumns}
          rows={result.rows}
          getRowKey={(row) => row.businessId}
        />
      );
    case 'trend':
      return <AreaTrendChart label="Hodnocení" points={result.points} height={240} />;
    case 'topics':
      return <TopicList topics={result.topics} />;
  }
}

export function AssistantResultView({ result }: { result: AssistantResult }) {
  return (
    <Paper variant="outlined" className="flex animate-fade-up flex-col gap-3 p-4">
      <Typography variant="subtitle2" component="h3">
        {result.title}
      </Typography>
      <ResultBody result={result} />
    </Paper>
  );
}
