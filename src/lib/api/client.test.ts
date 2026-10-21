import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { buildUrl, createApiClient } from './client';
import { ApiError, type ApiErrorKind } from './errors';

const BASE_URL = 'https://api.example.test/v1';
const itemSchema = z.object({ id: z.string() });

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function setup(response: Response | Promise<Response>) {
  const fetchFn = vi.fn<typeof fetch>().mockImplementation(async () => response);
  const client = createApiClient({ getBaseUrl: () => BASE_URL, fetchFn });
  return { client, fetchFn };
}

describe('buildUrl', () => {
  it('joins base URL and path, preserving the base path', () => {
    expect(buildUrl(BASE_URL, '/projects')).toBe(`${BASE_URL}/projects`);
  });

  it('adds query parameters and skips empty values', () => {
    const url = buildUrl(BASE_URL, 'projects', {
      page: 2,
      search: '',
      status: undefined,
      ok: true,
    });
    expect(url).toBe(`${BASE_URL}/projects?page=2&ok=true`);
  });
});

describe('createApiClient', () => {
  it('performs a GET request and returns the validated body', async () => {
    const { client, fetchFn } = setup(jsonResponse({ id: 'p-1' }));

    await expect(client.get('/projects/p-1', itemSchema)).resolves.toEqual({ id: 'p-1' });

    const [url, init] = fetchFn.mock.calls[0] ?? [];
    expect(url).toBe(`${BASE_URL}/projects/p-1`);
    expect(init).toMatchObject({ method: 'GET', headers: { Accept: 'application/json' } });
    expect(init?.body).toBeUndefined();
  });

  it('serialises the JSON body of a POST request', async () => {
    const { client, fetchFn } = setup(jsonResponse({ id: 'p-2' }, 201));

    await client.post('/projects', { name: 'New' }, itemSchema);

    const init = fetchFn.mock.calls[0]?.[1];
    expect(init?.method).toBe('POST');
    expect(init?.body).toBe(JSON.stringify({ name: 'New' }));
    expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' });
  });

  it('resolves DELETE with 204 No Content', async () => {
    const { client } = setup(new Response(null, { status: 204 }));
    await expect(client.delete('/projects/p-1')).resolves.toBeUndefined();
  });

  it.each<[number, ApiErrorKind]>([
    [400, 'bad_request'],
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [404, 'not_found'],
    [409, 'conflict'],
    [422, 'validation'],
    [429, 'rate_limited'],
    [500, 'server'],
    [503, 'server'],
    [418, 'unknown'],
  ])('maps HTTP %i to ApiError kind "%s"', async (status, kind) => {
    const { client } = setup(jsonResponse({ message: 'backend detail' }, status));

    const error = await client.get('/x', itemSchema).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ kind, status });
  });

  it('exposes field errors from a validation response', async () => {
    const body = { message: 'Invalid', errors: { name: ['Name is taken'] } };
    const { client } = setup(jsonResponse(body, 422));

    await expect(client.post('/projects', {}, itemSchema)).rejects.toMatchObject({
      kind: 'validation',
      fieldErrors: { name: ['Name is taken'] },
    });
  });

  it('handles non-JSON error bodies gracefully', async () => {
    const { client } = setup(new Response('<html>Internal error</html>', { status: 500 }));
    await expect(client.get('/x', itemSchema)).rejects.toMatchObject({ kind: 'server' });
  });

  it('converts fetch failures into network errors', async () => {
    const { client } = setup(Promise.reject(new TypeError('Failed to fetch')));
    await expect(client.get('/x', itemSchema)).rejects.toMatchObject({ kind: 'network' });
  });

  it('rethrows aborts untouched so callers can ignore them', async () => {
    const abort = new DOMException('Aborted', 'AbortError');
    const { client } = setup(Promise.reject(abort));
    await expect(client.get('/x', itemSchema)).rejects.toBe(abort);
  });

  it('rejects responses that do not match the schema', async () => {
    const { client } = setup(jsonResponse({ unexpected: true }));
    await expect(client.get('/x', itemSchema)).rejects.toMatchObject({ kind: 'invalid_response' });
  });
});
