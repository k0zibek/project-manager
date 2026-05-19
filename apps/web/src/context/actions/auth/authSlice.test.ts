import authReducer, { authActions } from 'context/actions/auth/authSlice';
import { INITIAL_AUTH_STATE } from 'context/actions/auth/config';

import { describe, expect, it } from 'vitest';

describe('authSlice', () => {
  it('setUser marks authenticated', () => {
    const user = {
      id: 'u1',
      email: 'a@b.com',
      name: 'Test',
      avatarUrl: null as string | null,
    };

    const state = authReducer(INITIAL_AUTH_STATE, authActions.setUser(user));

    expect(state.status).toBe('authenticated');
    expect(state.user).toEqual(user);
    expect(state.error).toBeNull();
  });

  it('clearAuth resets state', () => {
    const loggedIn = authReducer(
      INITIAL_AUTH_STATE,
      authActions.setUser({
        id: 'u1',
        email: 'a@b.com',
        name: 'Test',
        avatarUrl: null as string | null,
      }),
    );

    const state = authReducer(loggedIn, authActions.clearAuth());

    expect(state.status).toBe('unauthenticated');
    expect(state.user).toBeNull();
  });
});
