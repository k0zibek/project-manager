import jwt from 'jsonwebtoken';
import type { Env } from '../config/env.js';

export type TokenPayload = {
  sub: string;
  type: 'access' | 'refresh';
};

const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';

const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';

export { ACCESS_COOKIE, REFRESH_COOKIE };

/** Signs short-lived access token */
export function signAccessToken(env: Env, userId: string): string {
  return jwt.sign({ sub: userId, type: 'access' }, env.JWT_SECRET, { expiresIn: ACCESS_TTL });
}

/** Signs long-lived refresh token */
export function signRefreshToken(env: Env, userId: string): string {
  return jwt.sign({ sub: userId, type: 'refresh' }, env.JWT_SECRET, { expiresIn: REFRESH_TTL });
}

/** Verifies access token; rejects a refresh token presented as one */
export function verifyAccessToken(env: Env, token: string): TokenPayload {
  const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

  if (payload.type !== 'access') {
    throw new Error('Not an access token');
  }

  return payload;
}

/** Verifies refresh token; rejects an access token presented as one */
export function verifyRefreshToken(env: Env, token: string): TokenPayload {
  const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

  if (payload.type !== 'refresh') {
    throw new Error('Not a refresh token');
  }

  return payload;
}
