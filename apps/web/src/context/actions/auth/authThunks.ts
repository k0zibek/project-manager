import type {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from '@project-manager/shared';
import { authActions } from 'context/actions/auth/authSlice';
import type { AppDispatch } from 'context/store';

import {
  changePasswordApi,
  fetchMeApi,
  loginApi,
  logoutApi,
  registerApi,
  updateProfileApi,
} from 'features/auth/api/authApi';
import { getErrorMessage } from 'shared/errors/getErrorMessage';

/** Restores session from GET /auth/me */
export const bootstrapAuth = () => async (dispatch: AppDispatch) => {
  dispatch(authActions.setStatus('loading'));

  try {
    const { user } = await fetchMeApi();

    dispatch(authActions.setUser(user));
  } catch {
    dispatch(authActions.clearAuth());
  }
};

/** Logs in user */
export const loginUser = (credentials: LoginInput) => async (dispatch: AppDispatch) => {
  dispatch(authActions.setStatus('loading'));

  try {
    const { user } = await loginApi(credentials);

    dispatch(authActions.setUser(user));
  } catch (error) {
    const message = getErrorMessage(error, 'Login failed');

    dispatch(authActions.setError(message));

    throw new Error(message);
  }
};

/** Registers and logs in user */
export const registerUser = (data: RegisterInput) => async (dispatch: AppDispatch) => {
  dispatch(authActions.setStatus('loading'));

  try {
    const { user } = await registerApi(data);

    dispatch(authActions.setUser(user));
  } catch (error) {
    const message = getErrorMessage(error, 'Registration failed');

    dispatch(authActions.setError(message));

    throw new Error(message);
  }
};

/** Logs out user */
export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    await logoutApi();
  } finally {
    dispatch(authActions.clearAuth());
  }
};

/** Updates profile name/avatar */
export const updateUserProfile = (data: UpdateProfileInput) => async (dispatch: AppDispatch) => {
  try {
    const { user } = await updateProfileApi(data);

    dispatch(authActions.setUser(user));
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Update failed'));
  }
};

/** Changes password */
export const changeUserPassword = (data: ChangePasswordInput) => async () => {
  try {
    await changePasswordApi(data);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Password change failed'));
  }
};
