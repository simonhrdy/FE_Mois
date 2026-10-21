import type { ApiClient } from '@/lib/api/client';
import { authEndpoints } from '@/lib/api/endpoints/auth';
import { apiResponseSchema } from '@/lib/api/schemas';

import { authUserSchema, sessionSchema } from '../schemas/auth.schema';

import type { AuthRepository } from './auth.repository';

const sessionResponse = apiResponseSchema(sessionSchema);
const userResponse = apiResponseSchema(authUserSchema);

export function createHttpAuthRepository(client: ApiClient): AuthRepository {
  return {
    login: async (input) => (await client.post(authEndpoints.login, input, sessionResponse)).data,
    me: async (signal) => (await client.get(authEndpoints.me, userResponse, { signal })).data,
  };
}
