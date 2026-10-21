'use client';

import ReviewsOutlined from '@mui/icons-material/ReviewsOutlined';
import SentimentDissatisfiedOutlined from '@mui/icons-material/SentimentDissatisfiedOutlined';
import StarRateRounded from '@mui/icons-material/StarRateRounded';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { AsyncContent } from '@/components/ui/AsyncContent';
import { CardGridSkeleton, TableSkeleton } from '@/components/ui/Loading';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { MetricCard } from '@/components/ui/MetricCard';
import { TrendChip } from '@/components/ui/TrendChip';
import { useActiveBusiness } from '@/features/businesses/hooks/use-active-business';
import { useQueryParams } from '@/lib/hooks/use-query-params';
import {
  formatNumber,
  formatPercent,
  formatRating,
  formatRatingDelta,
  formatSignedNumber,
} from '@/lib/utils/format';

import { useAnalyticsReport } from '../hooks/use-analytics';
import { DEFAULT_ANALYTICS_PERIOD, periodQuerySchema } from '../schemas/stats.schema';
import type { AnalyticsReport } from '../services/analytics.service';
import { directionOf } from '../utils/rating-math';

import { PeriodToggle } from './PeriodToggle';
import { RatingDistribution } from './RatingDistribution';
import { AreaTrendChart } from './AreaTrendChart';
import { ReviewVolumeChart } from './ReviewVolumeChart';

const QUERY_DEFAULTS = { months: String(DEFAULT_ANALYTICS_PERIOD) };
const KPI_COUNT = 4;

function benchmarkLabel(report: AnalyticsReport): string {
  return report.benchmark.source === 'watchlist'
    ? `Průměr sledované konkurence (${report.benchmark.businessCount})`
    : `Průměr podniků v kategorii (${report.benchmark.businessCount})`;
}

const formatInteger = (value: number) => formatNumber(Math.round(value));

function Kpis({ report }: { report: AnalyticsReport }) {
  const monthly = report.current.monthly;
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Průměrné hodnocení"
        value={report.current.averageRating}
        format={formatRating}
        icon={<StarRateRounded />}
        badge={
          <TrendChip
            direction={directionOf(report.ratingChange)}
            label={`${formatRatingDelta(report.ratingChange)} vs. minule`}
          />
        }
        trend={monthly.map((point) => point.averageRating)}
      />
      <MetricCard
        label="Počet recenzí"
        value={report.current.reviewCount}
        format={formatInteger}
        icon={<ReviewsOutlined />}
        tone="secondary"
        badge={
          <Typography variant="caption" color="text.secondary">
            {formatSignedNumber(report.reviewCountChange)} vs. předchozí období
          </Typography>
        }
        trend={monthly.map((point) => point.reviewCount)}
      />
      <MetricCard
        label="Negativní recenze"
        value={report.current.negativeCount}
        format={formatInteger}
        icon={<SentimentDissatisfiedOutlined />}
        tone="error"
        badge={
          <Typography variant="caption" color="text.secondary">
            {formatPercent(report.negativeShare)} všech recenzí
          </Typography>
        }
        trend={monthly.map((point) => point.negativeCount)}
      />
      <MetricCard
        label="Proti konkurenci (★)"
        value={report.benchmarkDelta}
        format={formatRatingDelta}
        icon={<StorefrontOutlined />}
        tone="tertiary"
        badge={
          <Typography variant="caption" color="text.secondary">
            konkurence {formatRating(report.benchmark.averageRating)} ★
          </Typography>
        }
        trend={report.benchmark.monthly.map((point) => point.averageRating)}
      />
    </div>
  );
}

function Report({ report, businessName }: { report: AnalyticsReport; businessName: string }) {
  return (
    <>
      {report.trend === 'down' && (
        <Alert severity="warning">
          Hodnocení za poslední 3 měsíce klesá oproti předchozím třem měsícům. Projděte negativní
          recenze a zjistěte příčinu.
        </Alert>
      )}
      <Kpis report={report} />
      <Card>
        <CardHeader
          title="Vývoj hodnocení"
          subheader="Měsíční průměr hvězdiček: váš podnik vs. konkurence"
          action={<TrendChip direction={report.trend} />}
        />
        <CardContent>
          <AreaTrendChart
            label={businessName}
            points={report.current.monthly}
            benchmark={{ label: benchmarkLabel(report), points: report.benchmark.monthly }}
            height={320}
          />
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader title="Počet recenzí" subheader="Negativní vs. ostatní recenze po měsících" />
          <CardContent>
            <ReviewVolumeChart points={report.current.monthly} />
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader title="Rozložení hodnocení" subheader="Za zvolené období" />
          <CardContent>
            <RatingDistribution distribution={report.current.distribution} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export function AnalyticsView({ businessId }: { businessId: string }) {
  const { summary } = useActiveBusiness();
  const { params, update } = useQueryParams(periodQuerySchema, QUERY_DEFAULTS);
  const report = useAnalyticsReport(businessId, params.months);

  return (
    <PageContainer>
      <PageHeader
        title="Analytika"
        description="Jak se vyvíjí hodnocení a jak si vedete proti konkurenci."
        actions={<PeriodToggle value={params.months} onChange={(months) => update({ months })} />}
      />
      <AsyncContent
        result={report}
        errorTitle="Analytiku se nepodařilo načíst"
        loading={
          <>
            <CardGridSkeleton count={KPI_COUNT} />
            <TableSkeleton />
          </>
        }
      >
        {(data) => <Report report={data} businessName={summary?.name ?? 'Můj podnik'} />}
      </AsyncContent>
    </PageContainer>
  );
}
