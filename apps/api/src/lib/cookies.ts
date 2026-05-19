import type { FastifyReply } from 'fastify';
import { ACCESS_COOKIE, REFRESH_COOKIE } from './jwt.js';
import type { AuthTokens } from '../services/auth.service.js';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * ONE_DAY_MS;

/** Sets httpOnly auth cookies on response */
export function setAuthCookies(reply: FastifyReply, tokens: AuthTokens, secure: boolean) {
  reply.setCookie(ACCESS_COOKIE, tokens.accessToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60,
  });

  reply.setCookie(REFRESH_COOKIE, tokens.refreshToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: SEVEN_DAYS_MS / 1000,
  });
}

/** Clears auth cookies */
export function clearAuthCookies(reply: FastifyReply) {
  reply.clearCookie(ACCESS_COOKIE, { path: '/' });
  reply.clearCookie(REFRESH_COOKIE, { path: '/' });
}
