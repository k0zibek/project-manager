import { ApiError, type ApiErrorBody } from '@project-manager/shared';

import { notifyUnauthorized } from 'shared/api/authSession';

const HTTP_NO_CONTENT = 204;
const HTTP_UNAUTHORIZED = 401;

type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

const getBaseUrl = () => import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

const buildUrl = (path: string) => {
  if (path.startsWith('http')) {
    return path;
  }

  const base = getBaseUrl().replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${base}${normalizedPath}`;
};

/** Typed fetch wrapper with credentials and unified API errors */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const requestHeaders = new Headers(headers);

  let requestBody: BodyInit | undefined;

  if (body instanceof FormData) {
    requestBody = body;
  } else if (body != null) {
    requestHeaders.set('Content-Type', 'application/json');
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(buildUrl(path), {
    ...rest,
    credentials: 'include',
    headers: requestHeaders,
    body: requestBody,
  });

  if (response.status === HTTP_NO_CONTENT) {
    return null as T;
  }

  const payload: unknown = await response.json().catch((): null => null);

  if (!response.ok) {
    const apiBody = payload as ApiErrorBody | null;
    const code = apiBody?.error?.code ?? 'REQUEST_FAILED';
    const message = apiBody?.error?.message ?? response.statusText;

    if (response.status === HTTP_UNAUTHORIZED && code === 'UNAUTHORIZED') {
      notifyUnauthorized();
    }

    throw new ApiError(code, message, response.status);
  }

  return payload as T;
}
