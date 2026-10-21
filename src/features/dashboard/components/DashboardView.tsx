'use client';

import ForumOutlined from '@mui/icons-material/ForumOutlined';
import InsightsOutlined from '@mui/icons-material/InsightsOutlined';
import SentimentDissatisfiedOutlined from '@mui/icons-material/SentimentDissatisfiedOutlined';
import StarRounded from '@mui/icons-material/StarRounded';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';

import { AsyncContent } from '@/components/ui/AsyncContent';
import { CardGridSkeleton } from '@/components/ui/Loading';
import { MetricCard } from '@/components/ui/MetricCard';
import { PageContainer } from '@/components/ui/PageContainer';
import { TrendChip } from '@/components/ui/TrendChip';
import { AreaTrendChart } from '@/features/analytics/components/AreaTrendChart';
import { InsightSummaryCard } from '@/features/insights/components/InsightSummaryCard';
import { TopicInsightsCard } from '@/features/insights/components/TopicInsightsCard';
import { ReviewList } from '@/features/reviews/components/ReviewList';
import { RECENT_PERIOD_DAYS } from '@/lib/config/app';
import { routes } from '@/lib/config/routes';
import {
  formatNumber,
  formatPercent,
  formatRating,
  formatRatingDelta,
  formatSignedNumber,
} from '@/lib/utils/format';

import { useDashboardOverview } from '../hooks/use-dashboard';
import type { DashboardOverview } from '../services/dashboard.service';

import { DashboardHero } from './DashboardHero';
import { RankingCard } from './RankingCard';

const KPI_COUNT = 4;
const LATEST_REVIEWS_SHOWN = 4;

const RECENT_TREND_MONTHS = 6;

const formatInteger = (value: number) => formatNumber(Math.round(value));

function Metrics({ overview }: { overview: DashboardOverview }) {
  const { business, recent, previous, yearTrend } = overview;
  const monthly = yearTrend.monthly;
  const negativeShare = recent.reviewCount > 0 ? recent.negativeCount / recent.reviewCount : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Celkové hodnocení"
        value={business.stars}
        format={formatRating}
        icon={<StarRounded />}
        badge={
          <Typography variant="caption" color="text.secondary">
            z {formatNumber(business.reviewCount)} recenzí
          </Typography>
        }
        trend={monthly.map((point) => point.averageRating)}
      />
      <MetricCard
        label={`Hodnocení za ${RECENT_PERIOD_DAYS} dní`}
        value={recent.averageRating}
        format={formatRating}
        icon={<InsightsOutlined />}
        tone="tertiary"
        badge={
          <TrendChip
            direction={overview.recentDirection}
            label={`${formatRatingDelta(overview.recentRatingChange)} vs. minule`}
          />
        }
        trend={monthly.slice(-RECENT_TREND_MONTHS).map((point) => point.averageRating)}
      />
      <MetricCard
        label={`Nové recenze (${RECENT_PERIOD_DAYS} dní)`}
        value={recent.reviewCount}
        format={formatInteger}
        icon={<ForumOutlined />}
        tone="secondary"
        badge={
          <Typography variant="caption" color="text.secondary">
            {formatSignedNumber(recent.reviewCount - previous.reviewCount)} vs. předchozích{' '}
            {RECENT_PERIOD_DAYS} dní
          </Typography>
        }
        trend={monthly.map((point) => point.reviewCount)}
      />
      <MetricCard
        label={`Negativní recenze (${RECENT_PERIOD_DAYS} dní)`}
        value={recent.negativeCount}
        format={formatInteger}
        icon={<SentimentDissatisfiedOutlined />}
        tone="error"
        badge={
          <Typography variant="caption" color="text.secondary">
            {formatPercent(negativeShare)} nových recenzí
          </Typography>
        }
        trend={monthly.map((point) => point.negativeCount)}
      />
    </div>
  );
}

function Overview({ overview }: { overview: DashboardOverview }) {
  const { business } = overview;
  return (
    <>
      <DashboardHero overview={overview} />
      <Metrics overview={overview} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader
            title="Vývoj hodnocení"
            subheader="Měsíční průměr za posledních 12 měsíců"
            action={<TrendChip direction={overview.trend} />}
          />
          <CardContent>
            <AreaTrendChart label={business.name} points={overview.yearTrend.monthly} />
            <Button component={NextLink} href={routes.analytics}>
              Podrobná analytika
            </Button>
          </CardContent>
        </Card>
        <div className="min-w-0">
          <InsightSummaryCard summary={overview.summary} />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="min-w-0">
          <TopicInsightsCard
            topics={overview.topics}
            subheader={`Témata negativních recenzí · ${RECENT_PERIOD_DAYS} dní`}
          />
        </div>
        <Card className="min-w-0">
          <CardHeader
            title="Poslední recenze"
            action={
              <Button component={NextLink} href={routes.reviews} size="small">
                Vše
              </Button>
            }
          />
          <CardContent>
            <ReviewList reviews={overview.latestReviews.slice(0, LATEST_REVIEWS_SHOWN)} />
          </CardContent>
        </Card>
        <div className="min-w-0">
          <RankingCard
            competition={overview.competition}
            category={business.categories[0] ?? ''}
            city={business.city}
          />
        </div>
      </div>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <Skeleton variant="rounded" height={280} sx={{ borderRadius: 5 }} />
      <CardGridSkeleton count={KPI_COUNT} height={150} />
      <Skeleton variant="rounded" height={360} sx={{ borderRadius: 5 }} />
    </>
  );
}

export function DashboardView({ businessId }: { businessId: string }) {
  const overview = useDashboardOverview(businessId);

  return (
    <PageContainer>
      <AsyncContent
        result={overview}
        errorTitle="Přehled se nepodařilo načíst"
        loading={<DashboardSkeleton />}
      >
        {(data) => <Overview overview={data} />}
      </AsyncContent>
    </PageContainer>
  );
}
