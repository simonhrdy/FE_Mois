import type { ApiClient } from '@/lib/api/client';
import { businessEndpoints } from '@/lib/api/endpoints/businesses';
import { apiResponseSchema } from '@/lib/api/schemas';

import { businessSchema } from '../schemas/business.schema';

import type { BusinessRepository } from './business.repository';

const businessResponse = apiResponseSchema(businessSchema);

export function createHttpBusinessRepository(client: ApiClient): BusinessRepository {
  return {
    getById: async (id, signal) =>
      (await client.get(businessEndpoints.detail(id), businessResponse, { signal })).data,
  };
}
