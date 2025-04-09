import { authActions } from 'context/actions/auth/authSlice';
import { fakeFetchProfileApi, fakeLoginApi, fakeUpdateUserApi } from 'api/authApi';
import type { IUser } from 'constants/types';
import { getItem, setItem } from 'helpers/localStorage';
import type { AppDispatch } from 'context/store';

export const loginUser = (credentials: { email: string; password: string }) => async (dispatch: AppDispatch) => {
  try {
    dispatch(authActions.requestStart());

    const response = await fakeLoginApi(credentials);

    setItem('token', response.token);

    dispatch(authActions.loginSuccess(response));
  } catch (error: any) {
    dispatch(authActions.requestFailure(error.message));

    throw error.message;
  }
};

export const fetchUserProfile = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(authActions.requestStart());

    const token = getItem('token');

    if (!token) {
      dispatch(authActions.requestFailure('Токен не найден'));

      return;
    }

    const userProfile = await fakeFetchProfileApi(token);

    dispatch(authActions.fetchProfileSuccess(userProfile));
  } catch (error: any) {
    dispatch(authActions.requestFailure(error.message));

    throw error.message;
  }
};

export const updateUserData = (data: Partial<IUser>) => async (dispatch: AppDispatch) => {
  try {
    dispatch(authActions.requestStart());

    const token = getItem('token');

    if (!token) {
      dispatch(authActions.requestFailure('Токен не найден'));

      return;
    }

    const updatedUser = await fakeUpdateUserApi(data, token);

    dispatch(authActions.updateUserSuccess(updatedUser));
  } catch (error: any) {
    dispatch(authActions.requestFailure(error.message));

    throw error.message;
  }
};
