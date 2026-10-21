import { describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api/errors';

import type { AuthRepository } from '../repositories';

import { createAuthService } from './auth.service';

const user = { id: 'u1', name: 'Marco Rossi', email: 'marco@test.dev', businesses: [] };

function setup(repository: Partial<AuthRepository>, token: string | null = 'token') {
  const storage = { getToken: vi.fn(() => token), setToken: vi.fn(), clear: vi.fn() };
  const service = createAuthService({ login: vi.fn(), me: vi.fn(), ...repository }, storage);
  return { service, storage };
}

describe('authService', () => {
  it('stores the token after a successful login', async () => {
    const { service, storage } = setup({
      login: vi.fn().mockResolvedValue({ token: 'abc', user }),
    });
    await expect(service.login({ email: user.email, password: 'password1' })).resolves.toEqual(
      user,
    );
    expect(storage.setToken).toHaveBeenCalledWith('abc');
  });

  it('restores nothing without a stored token', async () => {
    const me = vi.fn();
    const { service } = setup({ me }, null);
    await expect(service.restore()).resolves.toBeNull();
    expect(me).not.toHaveBeenCalled();
  });

  it('discards an expired token', async () => {
    const { service, storage } = setup({
      me: vi.fn().mockRejectedValue(new ApiError('unauthorized', 'expired', { status: 401 })),
    });
    await expect(service.restore()).resolves.toBeNull();
    expect(storage.clear).toHaveBeenCalled();
  });

  it('propagates other errors (e.g. network) so the UI can report them', async () => {
    const { service, storage } = setup({
      me: vi.fn().mockRejectedValue(new ApiError('network', 'down')),
    });
    await expect(service.restore()).rejects.toMatchObject({ kind: 'network' });
    expect(storage.clear).not.toHaveBeenCalled();
  });
});
