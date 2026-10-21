import { describe, expect, it } from 'vitest';

import { ConfigurationError } from '@/lib/config/env';

import { ApiError, CONFIGURATION_ERROR_MESSAGE, getErrorMessage, isApiError } from './errors';

describe('getErrorMessage', () => {
  it('returns a friendly message instead of the technical backend message', () => {
    const error = ApiError.fromResponse(500, {
      message: 'NullPointerException at Service.java:42',
    });

    const message = getErrorMessage(error);

    expect(message).toBe('Na serveru došlo k chybě. Zkuste to prosím později.');
    expect(message).not.toContain('NullPointerException');
  });

  it.each([
    [401, /přihlaste se/i],
    [403, /oprávnění/i],
    [404, /nebyl nalezen/i],
    [409, /konfliktu/i],
    [429, /příliš mnoho/i],
  ])('maps status %i to a specific message', (status, expected) => {
    expect(getErrorMessage(ApiError.fromResponse(status, undefined))).toMatch(expected);
  });

  it('describes network failures', () => {
    expect(getErrorMessage(new ApiError('network', 'fetch failed'))).toMatch(/nelze se spojit/i);
  });

  it('handles configuration errors', () => {
    expect(getErrorMessage(new ConfigurationError('missing url'))).toBe(
      CONFIGURATION_ERROR_MESSAGE,
    );
  });

  it('falls back to a generic message for unknown values', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('Něco se nepovedlo. Zkuste to prosím znovu.');
    expect(getErrorMessage('string')).toBe('Něco se nepovedlo. Zkuste to prosím znovu.');
  });
});

describe('isApiError', () => {
  it('narrows by kind', () => {
    const error = new ApiError('not_found', 'missing');
    expect(isApiError(error)).toBe(true);
    expect(isApiError(error, 'not_found')).toBe(true);
    expect(isApiError(error, 'server')).toBe(false);
    expect(isApiError(new Error('x'))).toBe(false);
  });
});
