import jwt from 'jsonwebtoken';
import type { Env } from '../config/env.js';

export type TokenPayload = {
  sub: string;
};

const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';

const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';

export { ACCESS_COOKIE, REFRESH_COOKIE };

/** Signs short-lived access token */
export function signAccessToken(env: Env, userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: ACCESS_TTL });
}

/** Signs long-lived refresh token */
export function signRefreshToken(env: Env, userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: REFRESH_TTL });
}

/** Verifies access token */
export function verifyAccessToken(env: Env, token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}

/** Verifies refresh token */
export function verifyRefreshToken(env: Env, token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}
