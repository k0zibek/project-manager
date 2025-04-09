// api
import axiosInstance from 'api/axiosInstance';
// constants
import type { IUser } from 'constants/types';
// helpers
import { setItem } from 'helpers/localStorage';

const FAKE_TOKENS: Record<string, string> = JSON.parse(localStorage.getItem('FAKE_TOKENS') || '{}');

const saveTokens = () => {
  setItem('FAKE_TOKENS', FAKE_TOKENS);
};

const findUserId = (token: string): string | null => {
  const userId = Object.keys(FAKE_TOKENS).find((id) => FAKE_TOKENS[id] === token);

  return userId || null;
};

export const getUserById = async (id: string) => {
  const { data: user } = await axiosInstance.get(`/users/${id}`);

  return user || null;
};

export const fakeLoginApi = async (credentials: { email: string; password: string }) => {
  const { data: user } = await axiosInstance.get(`/users?email=${credentials.email}&password=${credentials.password}`);

  if (!user[0]) {
    throw new Error('Пользователя с таким email нет в базе');
  }

  FAKE_TOKENS[user[0].id] = `fake-jwt-token-${user[0].id}`;

  saveTokens();

  return { user: user[0], token: FAKE_TOKENS[user[0].id] };
};

export const fakeFetchProfileApi = async (token: string) => {
  const userId = findUserId(token);
  const user = await getUserById(userId);

  if (!userId || !user) {
    throw new Error('Неавторизованный запрос или пользователь не найден');
  }

  return user;
};

export const fakeUpdateUserApi = async (data: Partial<IUser>, token: string) => {
  const userId = findUserId(token);
  const user = await getUserById(userId);

  if (!userId || !user) {
    throw new Error('Неавторизованный запрос или пользователь не найден');
  }

  const updatedUser = { ...user, ...data };

  const { data: response } = await axiosInstance.put(`/users/${userId}`, updatedUser);

  return response;
};
