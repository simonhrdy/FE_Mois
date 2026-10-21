import type { ApiClient } from '@/lib/api/client';
import { assistantEndpoints } from '@/lib/api/endpoints/assistant';
import { apiResponseSchema } from '@/lib/api/schemas';

import { assistantResponseSchema } from '../schemas/assistant.schema';

import type { AssistantRepository } from './assistant.repository';

const assistantResponse = apiResponseSchema(assistantResponseSchema);

export function createHttpAssistantRepository(client: ApiClient): AssistantRepository {
  return {
    ask: async (request, signal) =>
      (await client.post(assistantEndpoints.query, request, assistantResponse, { signal })).data,
  };
}
