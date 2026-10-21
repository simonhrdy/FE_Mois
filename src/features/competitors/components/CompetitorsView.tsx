'use client';

import BookmarksOutlined from '@mui/icons-material/BookmarksOutlined';
import Search from '@mui/icons-material/Search';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';

import { AsyncContent } from '@/components/ui/AsyncContent';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/Loading';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { SEARCH_DEBOUNCE_MS } from '@/lib/config/app';
import { routes } from '@/lib/config/routes';
import { useDebouncedValue } from '@/lib/hooks/use-debounced-value';
import { useQueryParams } from '@/lib/hooks/use-query-params';

import { useCompetitors, useWatchlist } from '../hooks/use-competitors';
import {
  COMPETITOR_SORTS,
  competitorQuerySchema,
  WATCHLIST_LIMIT,
} from '../schemas/competitor.schema';
import type { CompetitorSort } from '../types/competitor.types';

import { CompetitorsTable } from './CompetitorsTable';

const QUERY_DEFAULTS = { sort: 'rating' };

const SORT_LABELS: Record<CompetitorSort, string> = {
  rating: 'Nejlepší hodnocení',
  reviews: 'Nejvíce recenzí',
  name: 'Název',
};

const toSort = (value: string) => COMPETITOR_SORTS.find((sort) => sort === value);

export function CompetitorsView({ businessId }: { businessId: string }) {
  const { params, update } = useQueryParams(competitorQuerySchema, QUERY_DEFAULTS);
  const [searchInput, setSearchInput] = useState(params.search);
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const competitors = useCompetitors(businessId, params);
  const { watchedIds, toggle, pendingId } = useWatchlist(businessId);
  const limitReached = watchedIds.size >= WATCHLIST_LIMIT;

  useEffect(() => {
    if (debouncedSearch !== params.search) update({ search: debouncedSearch });
  }, [debouncedSearch, params.search, update]);

  return (
    <PageContainer>
      <PageHeader
        title="Konkurence"
        description="Podniky ze stejné kategorie a lokality jako váš podnik."
        actions={
          <Button
            component={NextLink}
            href={routes.watchedCompetitors}
            variant="outlined"
            startIcon={<BookmarksOutlined />}
          >
            Moje konkurence ({watchedIds.size}/{WATCHLIST_LIMIT})
          </Button>
        }
      />
      {limitReached && (
        <Alert severity="info">
          Sledujete maximální počet {WATCHLIST_LIMIT} konkurentů. Pro přidání dalšího některého
          odeberte.
        </Alert>
      )}
      <Card>
        <div role="search" className="flex flex-col gap-3 p-4 sm:flex-row">
          <TextField
            type="search"
            size="small"
            label="Hledat podnik"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            select
            size="small"
            label="Řazení"
            value={params.sort}
            onChange={(event) => update({ sort: toSort(event.target.value) })}
            fullWidth={false}
            sx={{ minWidth: { sm: 220 } }}
          >
            {COMPETITOR_SORTS.map((sort) => (
              <MenuItem key={sort} value={sort}>
                {SORT_LABELS[sort]}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <Divider />
        <AsyncContent
          result={competitors}
          loading={<TableSkeleton />}
          errorTitle="Konkurenci se nepodařilo načíst"
          isEmpty={(list) => list.length === 0}
          empty={
            <EmptyState
              title="Žádní konkurenti nenalezeni"
              description="V této kategorii a lokalitě nejsou jiné podniky, nebo neodpovídají hledání."
            />
          }
        >
          {(list) => (
            <CompetitorsTable
              competitors={list}
              watchedIds={watchedIds}
              pendingId={pendingId}
              limitReached={limitReached}
              onToggleWatch={(competitor) => void toggle(competitor)}
            />
          )}
        </AsyncContent>
      </Card>
    </PageContainer>
  );
}
