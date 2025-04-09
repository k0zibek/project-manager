import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IUser } from 'constants/types';
import { INITIAL_AUTH_STATE } from 'context/actions/auth/config';
import { clearItem } from 'helpers/localStorage';

/* eslint no-param-reassign: "error" */
const authSlice = createSlice({
  name: 'auth',
  initialState: INITIAL_AUTH_STATE,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },
    requestFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    loginSuccess(state, action: PayloadAction<{ user: IUser; token: string }>) {
      state.loading = false;
      state.user = action.payload.user;
      state.userId = action.payload.user.id;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    fetchProfileSuccess(state, action: PayloadAction<IUser>) {
      state.loading = false;
      state.user = action.payload;
      state.userId = action.payload.id;
    },
    updateUserSuccess(state, action: PayloadAction<Partial<IUser>>) {
      state.loading = false;

      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout(state) {
      state.user = null;
      state.userId = null;
      state.token = null;
      state.isAuthenticated = false;
      clearItem('token');
      clearItem('FAKE_TOKENS');
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
