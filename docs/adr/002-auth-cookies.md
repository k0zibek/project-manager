# ADR 002: Authentication with httpOnly cookies

## Status

Accepted

## Context

The lab used fake tokens in `localStorage` and Redux. For a portfolio API we need real sessions without exposing tokens to JavaScript (XSS risk).

## Decision

- **Access JWT** (short TTL) and **refresh JWT** (longer TTL) stored in **httpOnly** cookies.
- `apiFetch` uses `credentials: 'include'` for all API calls.
- `GET /auth/me` restores session on app load (`AuthBootstrap`).
- `requireAuth` middleware refreshes access token when expired but refresh is valid.
- On `401` + `UNAUTHORIZED`, `apiFetch` calls `notifyUnauthorized()` → Redux `clearAuth`.

Cookie flags:

- `sameSite: 'lax'` (dev and prod baseline)
- `secure: true` when `NODE_ENV === 'production'`

Passwords hashed with bcrypt (cost 12). Shared Zod schemas for login/register/profile in `packages/shared`.

## Consequences

- **Positive:** Tokens not readable from JS; works with SPA on another origin when CORS + credentials configured.
- **Negative:** Cross-origin deploy requires explicit `CORS_ORIGIN` and cookie settings; no mobile native client without cookie jar support.
- **Out of scope v1:** OAuth, email verification, refresh token rotation store.
