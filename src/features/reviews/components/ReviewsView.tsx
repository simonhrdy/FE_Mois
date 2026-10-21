'use client';

import FilterAltOffOutlined from '@mui/icons-material/FilterAltOffOutlined';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { AsyncContent } from '@/components/ui/AsyncContent';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { useActiveBusiness } from '@/features/businesses/hooks/use-active-business';
import { DEFAULT_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from '@/lib/config/app';
import { useDebouncedValue } from '@/lib/hooks/use-debounced-value';
import { useQueryParams } from '@/lib/hooks/use-query-params';
import { formatNumber } from '@/lib/utils/format';

import { useReviews } from '../hooks/use-reviews';
import { MAX_STARS, MIN_STARS, reviewQuerySchema } from '../schemas/review.schema';

import { ReviewFilters } from './ReviewFilters';
import { ReviewList } from './ReviewList';

const QUERY_DEFAULTS: Record<string, string> = {
  page: '1',
  pageSize: String(DEFAULT_PAGE_SIZE),
  minStars: String(MIN_STARS),
  maxStars: String(MAX_STARS),
  sort: 'newest',
};

function ReviewsSkeleton() {
  return (
    <Stack spacing={3} role="status" aria-label="Načítání recenzí" className="p-4">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} variant="rounded" height={96} />
      ))}
    </Stack>
  );
}

export function ReviewsView({ businessId }: { businessId: string }) {
  const { summary } = useActiveBusiness();
  const { params, update } = useQueryParams(reviewQuerySchema, QUERY_DEFAULTS);
  const [searchInput, setSearchInput] = useState(params.search);
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const reviews = useReviews(businessId, params);

  useEffect(() => {
    if (debouncedSearch !== params.search) update({ search: debouncedSearch, page: undefined });
  }, [debouncedSearch, params.search, update]);

  return (
    <PageContainer>
      <PageHeader
        title="Recenze"
        description={`Všechny recenze podniku ${summary?.name ?? ''}. Filtrujte podle hodnocení, data nebo textu.`}
      />
      <Card>
        <ReviewFilters
          query={params}
          search={searchInput}
          onSearchChange={setSearchInput}
          onChange={update}
        />
        <Divider />
        <AsyncContent
          result={reviews}
          loading={<ReviewsSkeleton />}
          errorTitle="Recenze se nepodařilo načíst"
          isEmpty={(page) => page.data.length === 0}
          empty={
            <EmptyState
              icon={<FilterAltOffOutlined />}
              title="Žádné recenze neodpovídají filtrům"
              description="Zkuste rozšířit rozsah hvězdiček nebo období."
            />
          }
        >
          {(page) => (
            <CardContent className="flex flex-col gap-4">
              <Typography variant="body2" color="text.secondary" role="status">
                Nalezeno {formatNumber(page.meta.totalItems)} recenzí
              </Typography>
              <ReviewList reviews={page.data} />
              {page.meta.totalPages > 1 && (
                <Pagination
                  className="self-center pt-2"
                  count={page.meta.totalPages}
                  page={page.meta.page}
                  onChange={(_event, value) => update({ page: value })}
                  color="primary"
                  siblingCount={0}
                  getItemAriaLabel={(type, value) =>
                    type === 'page' ? `Stránka ${value}` : type === 'next' ? 'Další' : 'Předchozí'
                  }
                />
              )}
            </CardContent>
          )}
        </AsyncContent>
      </Card>
    </PageContainer>
  );
}
