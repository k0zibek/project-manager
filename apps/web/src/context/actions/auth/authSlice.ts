import type { UserDTO } from '@project-manager/shared';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthStatus } from 'constants/types';
import { INITIAL_AUTH_STATE } from 'context/actions/auth/config';

/* eslint no-param-reassign: "error" */
const authSlice = createSlice({
  name: 'auth',
  initialState: INITIAL_AUTH_STATE,
  reducers: {
    setStatus(state, action: PayloadAction<AuthStatus>) {
      state.status = action.payload;
    },
    setUser(state, action: PayloadAction<UserDTO>) {
      state.user = action.payload;
      state.status = 'authenticated';
      state.error = null;
    },
    patchUser(state, action: PayloadAction<Partial<UserDTO>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = 'unauthenticated';
    },
    clearAuth(state) {
      state.user = null;
      state.status = 'unauthenticated';
      state.error = null;
    },
  },
});

export const authActions = authSlice.actions;

export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.status === 'authenticated';

export default authSlice.reducer;
