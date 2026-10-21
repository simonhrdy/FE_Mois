'use client';

import ArrowBack from '@mui/icons-material/ArrowBack';
import SearchOff from '@mui/icons-material/SearchOff';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';
import NextLink from 'next/link';
import { useMemo } from 'react';

import { AsyncContent } from '@/components/ui/AsyncContent';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { TableSkeleton } from '@/components/ui/Loading';
import { PageContainer } from '@/components/ui/PageContainer';
import { RatingDistribution } from '@/features/analytics/components/RatingDistribution';
import { RatingTrendChart } from '@/features/analytics/components/RatingTrendChart';
import { useBusinessStats } from '@/features/analytics/hooks/use-analytics';
import { WatchButton } from '@/features/competitors/components/WatchButton';
import { useWatchlist } from '@/features/competitors/hooks/use-competitors';
import { ReviewList } from '@/features/reviews/components/ReviewList';
import { useLatestReviews } from '@/features/reviews/hooks/use-reviews';
import { isApiError } from '@/lib/api/errors';
import { routes } from '@/lib/config/routes';
import { lastMonthsRange } from '@/lib/utils/date';

import { useActiveBusiness } from '../hooks/use-active-business';
import { useBusiness } from '../hooks/use-business';
import type { Business } from '../types/business.types';

import { BusinessHeader } from './BusinessHeader';

const DETAIL_PERIOD_MONTHS = 12;

const backLink = (
  <Button
    component={NextLink}
    href={routes.competitors}
    startIcon={<ArrowBack />}
    size="small"
    className="self-start"
  >
    Konkurence
  </Button>
);

function BusinessDetail({
  business,
  ownBusinessId,
}: {
  business: Business;
  ownBusinessId: string;
}) {
  const range = useMemo(() => lastMonthsRange(DETAIL_PERIOD_MONTHS), []);
  const stats = useBusinessStats(business.id, range);
  const reviews = useLatestReviews(business.id);
  const { watchedIds, toggle, pendingId } = useWatchlist(ownBusinessId);
  const isOwn = business.id === ownBusinessId;

  return (
    <>
      <BusinessHeader
        business={business}
        eyebrow={backLink}
        actions={
          isOwn ? undefined : (
            <WatchButton
              size="medium"
              watched={watchedIds.has(business.id)}
              pending={pendingId === business.id}
              onClick={() => void toggle(business)}
            />
          )
        }
      />
      <AsyncContent result={stats} loading={<TableSkeleton />} errorTitle="Statistiky nelze načíst">
        {(data) => (
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="min-w-0 lg:col-span-2">
              <CardHeader
                title="Vývoj hodnocení"
                subheader={`Posledních ${DETAIL_PERIOD_MONTHS} měsíců`}
              />
              <CardContent>
                <RatingTrendChart series={[{ label: business.name, points: data.monthly }]} />
              </CardContent>
            </Card>
            <Card className="min-w-0">
              <CardHeader
                title="Rozložení hodnocení"
                subheader={`Posledních ${DETAIL_PERIOD_MONTHS} měsíců`}
              />
              <CardContent>
                <RatingDistribution distribution={data.distribution} />
              </CardContent>
            </Card>
          </div>
        )}
      </AsyncContent>
      <Card>
        <CardHeader title="Nejnovější recenze" />
        <CardContent>
          <AsyncContent
            result={reviews}
            loading={<Skeleton variant="rounded" height={240} />}
            isEmpty={(list) => list.length === 0}
            empty={<EmptyState size="compact" title="Podnik zatím nemá recenze" />}
          >
            {(list) => <ReviewList reviews={list} />}
          </AsyncContent>
        </CardContent>
      </Card>
    </>
  );
}

export function BusinessDetailView({ businessId }: { businessId: string }) {
  const business = useBusiness(businessId);
  const { businessId: ownBusinessId } = useActiveBusiness();

  return (
    <PageContainer>
      {business.status === 'loading' && <Skeleton variant="rounded" height={160} />}
      {business.status === 'error' &&
        (isApiError(business.error, 'not_found') ? (
          <EmptyState
            icon={<SearchOff />}
            title="Podnik nebyl nalezen"
            description="Odkaz je neplatný nebo podnik již není v databázi."
            action={backLink}
          />
        ) : (
          <ErrorState error={business.error} onRetry={business.reload} />
        ))}
      {business.status === 'success' && ownBusinessId && (
        <BusinessDetail business={business.data} ownBusinessId={ownBusinessId} />
      )}
    </PageContainer>
  );
}
