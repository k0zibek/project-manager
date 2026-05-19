import type { AuthState } from 'constants/types';

export const INITIAL_AUTH_STATE: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};
