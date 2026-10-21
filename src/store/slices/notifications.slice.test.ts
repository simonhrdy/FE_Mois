import { describe, expect, it } from 'vitest';

import { makeStore } from '@/store';

import {
  dismissNotification,
  selectCurrentNotification,
  showNotification,
} from './notifications.slice';

describe('notifications slice', () => {
  it('shows a notification with a generated id and default severity', () => {
    const store = makeStore();
    store.dispatch(showNotification('Saved'));

    expect(selectCurrentNotification(store.getState())).toMatchObject({
      message: 'Saved',
      severity: 'success',
      id: expect.any(String),
    });
  });

  it('dismisses only the matching notification', () => {
    const store = makeStore();
    store.dispatch(showNotification('First'));
    const first = selectCurrentNotification(store.getState());
    store.dispatch(showNotification('Second', 'error'));

    store.dispatch(dismissNotification(first?.id ?? ''));
    expect(selectCurrentNotification(store.getState())?.message).toBe('Second');
  });
});
