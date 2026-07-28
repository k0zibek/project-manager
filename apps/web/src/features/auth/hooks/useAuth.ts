import type {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from '@project-manager/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  changePasswordApi,
  fetchMeApi,
  loginApi,
  logoutApi,
  registerApi,
  updateProfileApi,
} from 'features/auth/api/authApi';
import { authKeys } from 'features/auth/queryKeys';

/** Loads the current session user (drives auth bootstrap) */
export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const { user } = await fetchMeApi();

      return user;
    },
    retry: false,
    staleTime: Infinity,
  });
}

/** Logs in and caches the session user */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginInput) => loginApi(credentials),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(authKeys.me(), user);
    },
  });
}

/** Registers and caches the session user */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterInput) => registerApi(data),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(authKeys.me(), user);
    },
  });
}

/** Logs out and clears the cached session */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutApi(),
    onSettled: () => {
      queryClient.setQueryData(authKeys.me(), null);
    },
  });
}

/** Updates profile fields and caches the result */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => updateProfileApi(data),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(authKeys.me(), user);
    },
  });
}

/** Changes the current user's password */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordInput) => changePasswordApi(data),
  });
}
