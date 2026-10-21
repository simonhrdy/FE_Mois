import { describe, expect, it } from 'vitest';

import { makeStore } from '@/store';

import { selectAuthStatus, sessionEnded, sessionStarted } from './auth.slice';
import { activeBusinessChanged, selectActiveBusinessId } from './workspace.slice';

const user = {
  id: 'u1',
  name: 'Marco',
  email: 'marco@test.dev',
  businesses: [
    { id: 'b1', name: 'Bella Pizza', city: 'Las Vegas' },
    { id: 'b2', name: 'Bella Summerlin', city: 'Las Vegas' },
  ],
};

describe('auth + workspace slices', () => {
  it('selects the first owned business when a session starts', () => {
    const store = makeStore();
    store.dispatch(sessionStarted(user));

    expect(selectAuthStatus(store.getState())).toBe('authenticated');
    expect(selectActiveBusinessId(store.getState())).toBe('b1');
  });

  it('keeps a valid selection and clears it on logout', () => {
    const store = makeStore();
    store.dispatch(sessionStarted(user));
    store.dispatch(activeBusinessChanged('b2'));
    store.dispatch(sessionStarted(user));
    expect(selectActiveBusinessId(store.getState())).toBe('b2');

    store.dispatch(sessionEnded());
    expect(selectAuthStatus(store.getState())).toBe('anonymous');
    expect(selectActiveBusinessId(store.getState())).toBeNull();
  });
});
