import type {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  UserDTO,
} from '@project-manager/shared';

import { apiFetch } from 'shared/api/client';

type AuthResponse = { user: UserDTO };

/** Returns current session user */
export const fetchMeApi = () => apiFetch<AuthResponse>('/auth/me');

/** Logs in with email/password (sets httpOnly cookies) */
export const loginApi = (credentials: LoginInput) => apiFetch<AuthResponse>('/auth/login', {
  method: 'POST',
  body: credentials,
});

/** Registers a new user */
export const registerApi = (data: RegisterInput) => apiFetch<AuthResponse>('/auth/register', {
  method: 'POST',
  body: data,
});

/** Clears session cookies */
export const logoutApi = () => apiFetch<void>('/auth/logout', { method: 'POST' });

/** Updates profile fields */
export const updateProfileApi = (data: UpdateProfileInput) => apiFetch<AuthResponse>('/auth/me', {
  method: 'PATCH',
  body: data,
});

/** Changes password */
export const changePasswordApi = (data: ChangePasswordInput) => apiFetch<void>('/auth/password', {
  method: 'PATCH',
  body: data,
});
