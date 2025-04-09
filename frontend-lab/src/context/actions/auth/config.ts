import type { AuthState } from 'constants/types';
import { getItem } from 'helpers/localStorage';

export const INITIAL_AUTH_STATE: AuthState = {
  user: null,
  userId: null,
  token: getItem('token'),
  isAuthenticated: !!getItem('token'),
  loading: false,
  error: null,
};
