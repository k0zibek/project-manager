import { ApiError, type ApiErrorBody } from '@project-manager/shared';

const HTTP_NO_CONTENT = 204;

type LegacyFetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

const getLegacyBaseUrl = () => import.meta.env.VITE_LEGACY_API_URL ?? 'http://localhost:8080';

const buildUrl = (path: string) => {
  const base = getLegacyBaseUrl().replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${base}${normalizedPath}`;
};

/** Fetch wrapper for legacy json-server (until PR 2–3 migration) */
export async function legacyApiFetch<T>(path: string, options: LegacyFetchOptions = {}): Promise<T> {
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

    throw new ApiError(code, message, response.status);
  }

  return payload as T;
}
