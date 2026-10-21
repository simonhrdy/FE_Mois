'use client';

import BookmarksOutlined from '@mui/icons-material/BookmarksOutlined';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import NextLink from 'next/link';

import { AsyncContent } from '@/components/ui/AsyncContent';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/Loading';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { PeriodToggle } from '@/features/analytics/components/PeriodToggle';
import { RatingTrendChart } from '@/features/analytics/components/RatingTrendChart';
import {
  DEFAULT_ANALYTICS_PERIOD,
  periodQuerySchema,
} from '@/features/analytics/schemas/stats.schema';
import { routes } from '@/lib/config/routes';
import { useQueryParams } from '@/lib/hooks/use-query-params';

import { useComparison, useWatchlist } from '../hooks/use-competitors';
import { WATCHLIST_LIMIT } from '../schemas/competitor.schema';

import { CompetitorRadar } from './CompetitorRadar';
import { ComparisonTable } from './ComparisonTable';

const QUERY_DEFAULTS = { months: String(DEFAULT_ANALYTICS_PERIOD) };

const OWN_ROW_ONLY = 1;

export function WatchedCompetitorsView({ businessId }: { businessId: string }) {
  const { params, update } = useQueryParams(periodQuerySchema, QUERY_DEFAULTS);
  const comparison = useComparison(businessId, params.months);
  const { toggle, pendingId } = useWatchlist(businessId, comparison.reload);

  return (
    <PageContainer>
      <PageHeader
        title="Moje konkurence"
        description={`Průběžné srovnání vašeho podniku s až ${WATCHLIST_LIMIT} sledovanými konkurenty.`}
        actions={<PeriodToggle value={params.months} onChange={(months) => update({ months })} />}
      />
      <AsyncContent
        result={comparison}
        loading={<TableSkeleton rows={WATCHLIST_LIMIT} />}
        errorTitle="Srovnání se nepodařilo načíst"
        isEmpty={(rows) => rows.length <= OWN_ROW_ONLY}
        empty={
          <Card>
            <EmptyState
              icon={<BookmarksOutlined />}
              title="Zatím nesledujete žádnou konkurenci"
              description="V modulu Konkurence si vyberte podniky, se kterými se chcete porovnávat."
              action={
                <Button component={NextLink} href={routes.competitors} variant="contained">
                  Najít konkurenci
                </Button>
              }
            />
          </Card>
        }
      >
        {(rows) => (
          <>
            <Card>
              <CardHeader title="Srovnání" subheader={`Posledních ${params.months} měsíců`} />
              <ComparisonTable
                rows={rows}
                pendingId={pendingId}
                onUnwatch={({ business }) => void toggle(business)}
              />
            </Card>
            <div className="grid gap-4 lg:grid-cols-5">
              <Card className="min-w-0 lg:col-span-2">
                <CardHeader
                  title="Profil podniku"
                  subheader="Vy vs. průměr sledované konkurence (0–100)"
                />
                <CardContent>
                  <CompetitorRadar
                    rows={rows}
                    ownName={rows.find((row) => row.isOwn)?.business.name ?? 'Můj podnik'}
                  />
                </CardContent>
              </Card>
              <Card className="min-w-0 lg:col-span-3">
                <CardHeader title="Vývoj hodnocení" subheader="Měsíční průměr hvězdiček" />
                <CardContent>
                  <RatingTrendChart
                    series={rows.map((row) => ({
                      label: row.business.name,
                      points: row.stats.monthly,
                    }))}
                  />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </AsyncContent>
    </PageContainer>
  );
}
