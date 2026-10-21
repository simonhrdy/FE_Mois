import { z } from 'zod';

import type { ApiClient } from '@/lib/api/client';
import { insightEndpoints } from '@/lib/api/endpoints/businesses';
import { apiResponseSchema } from '@/lib/api/schemas';

import { topicInsightSchema } from '../schemas/insight.schema';

import type { InsightRepository } from './insight.repository';

const topicsResponse = apiResponseSchema(z.array(topicInsightSchema));

export function createHttpInsightRepository(client: ApiClient): InsightRepository {
  return {
    getTopics: async (businessId, range, signal) =>
      (
        await client.get(insightEndpoints.topics(businessId), topicsResponse, {
          query: { ...range },
          signal,
        })
      ).data,
  };
}
