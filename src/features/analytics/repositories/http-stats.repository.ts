import type { ApiClient } from '@/lib/api/client';
import { businessEndpoints } from '@/lib/api/endpoints/businesses';
import { apiResponseSchema } from '@/lib/api/schemas';

import { businessStatsSchema } from '../schemas/stats.schema';

import type { StatsRepository } from './stats.repository';

const statsResponse = apiResponseSchema(businessStatsSchema);

export function createHttpStatsRepository(client: ApiClient): StatsRepository {
  return {
    getStats: async (businessId, range, signal) =>
      (
        await client.get(businessEndpoints.stats(businessId), statsResponse, {
          query: { ...range },
          signal,
        })
      ).data,
  };
}
