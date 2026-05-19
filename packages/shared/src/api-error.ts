/** Standard API error payload returned by apps/api */
export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
  };
};

/** Thrown by apiFetch when response is not ok */
export class ApiError extends Error {
  readonly code: string;

  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}
