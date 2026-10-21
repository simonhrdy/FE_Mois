import type { z } from 'zod';

import { sessionStorageAdapter } from '@/lib/auth/session-storage';
import { getApiBaseUrl } from '@/lib/config/env';

import { ApiError, HTTP_STATUS, isAbortError } from './errors';
import { apiErrorBodySchema } from './schemas';
import type { HttpMethod, QueryParams, RequestOptions } from './types';

type FetchFn = typeof fetch;

export interface ApiClientConfig {
  getBaseUrl: () => string;
  fetchFn?: FetchFn;

  getHeaders?: () => Record<string, string>;
}

export interface ApiClient {
  get<T>(path: string, schema: z.ZodType<T>, options?: RequestOptions): Promise<T>;
  post<T>(path: string, body: unknown, schema: z.ZodType<T>, options?: RequestOptions): Promise<T>;
  put<T>(path: string, body: unknown, schema: z.ZodType<T>, options?: RequestOptions): Promise<T>;
  patch<T>(path: string, body: unknown, schema: z.ZodType<T>, options?: RequestOptions): Promise<T>;
  delete(path: string, options?: RequestOptions): Promise<void>;
}

export function buildUrl(baseUrl: string, path: string, query?: QueryParams): string {
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const url = new URL(path.replace(/^\//, ''), base);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null || value === '') continue;
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

async function toApiError(response: Response): Promise<ApiError> {
  const parsedBody = apiErrorBodySchema.safeParse(await readJson(response));
  return ApiError.fromResponse(response.status, parsedBody.success ? parsedBody.data : undefined);
}

function parseResponse<T>(payload: unknown, schema: z.ZodType<T>): T {
  const result = schema.safeParse(payload);
  if (!result.success) {
    throw new ApiError('invalid_response', 'Response did not match the expected schema', {
      cause: result.error,
    });
  }
  return result.data;
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  const fetchFn = config.fetchFn ?? ((...args: Parameters<FetchFn>) => fetch(...args));

  async function send(
    method: HttpMethod,
    path: string,
    body: unknown,
    options: RequestOptions = {},
  ): Promise<unknown> {
    const hasBody = body !== undefined;
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...config.getHeaders?.(),
      ...options.headers,
    };

    let response: Response;
    try {
      response = await fetchFn(buildUrl(config.getBaseUrl(), path, options.query), {
        method,
        headers,
        body: hasBody ? JSON.stringify(body) : undefined,
        signal: options.signal,
      });
    } catch (error) {
      if (isAbortError(error)) throw error;
      if (error instanceof TypeError) {
        throw new ApiError('network', 'Network request failed', { cause: error });
      }
      throw error;
    }

    if (!response.ok) throw await toApiError(response);
    if (response.status === HTTP_STATUS.NO_CONTENT) return undefined;
    return readJson(response);
  }

  return {
    get: async (path, schema, options) =>
      parseResponse(await send('GET', path, undefined, options), schema),
    post: async (path, body, schema, options) =>
      parseResponse(await send('POST', path, body, options), schema),
    put: async (path, body, schema, options) =>
      parseResponse(await send('PUT', path, body, options), schema),
    patch: async (path, body, schema, options) =>
      parseResponse(await send('PATCH', path, body, options), schema),
    delete: async (path, options) => {
      await send('DELETE', path, undefined, options);
    },
  };
}

export const apiClient = createApiClient({
  getBaseUrl: getApiBaseUrl,
  getHeaders: (): Record<string, string> => {
    const token = sessionStorageAdapter.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});
