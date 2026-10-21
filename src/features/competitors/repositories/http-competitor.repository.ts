import { z } from 'zod';

import { businessSchema } from '@/features/businesses/schemas/business.schema';
import type { ApiClient } from '@/lib/api/client';
import { businessEndpoints } from '@/lib/api/endpoints/businesses';
import { apiResponseSchema } from '@/lib/api/schemas';

import { competitorSchema } from '../schemas/competitor.schema';

import type { CompetitorRepository } from './competitor.repository';

const competitorsResponse = apiResponseSchema(z.array(competitorSchema));
const watchlistResponse = apiResponseSchema(z.array(businessSchema));
const emptyResponse = z.unknown();

export function createHttpCompetitorRepository(client: ApiClient): CompetitorRepository {
  return {
    search: async (businessId, query, signal) =>
      (
        await client.get(businessEndpoints.competitors(businessId), competitorsResponse, {
          query: { ...query },
          signal,
        })
      ).data,
    getWatchlist: async (businessId, signal) =>
      (await client.get(businessEndpoints.watchlist(businessId), watchlistResponse, { signal }))
        .data,
    watch: async (businessId, competitorId) => {
      await client.put(
        businessEndpoints.watchlistItem(businessId, competitorId),
        {},
        emptyResponse,
      );
    },
    unwatch: (businessId, competitorId) =>
      client.delete(businessEndpoints.watchlistItem(businessId, competitorId)),
  };
}
