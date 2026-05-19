import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Env } from '../config/env.js';
import { HttpError } from '../lib/http-error.js';
import { setAuthCookies } from '../lib/cookies.js';
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  signAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../lib/jwt.js';

export type AuthenticatedRequest = FastifyRequest & {
  userId: string;
};

/** Resolves user id from cookies; refreshes access token when expired */
export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
  env: Env,
): Promise<string> {
  const accessToken = request.cookies[ACCESS_COOKIE];

  if (accessToken) {
    try {
      const payload = verifyAccessToken(env, accessToken);

      return payload.sub;
    } catch {
      // access expired — try refresh
    }
  }

  const refreshToken = request.cookies[REFRESH_COOKIE];

  if (!refreshToken) {
    throw new HttpError(401, 'UNAUTHORIZED', 'Authentication required');
  }

  try {
    const payload = verifyRefreshToken(env, refreshToken);
    const newAccess = signAccessToken(env, payload.sub);

    setAuthCookies(reply, {
      accessToken: newAccess,
      refreshToken,
    }, env.NODE_ENV === 'production');

    return payload.sub;
  } catch {
    throw new HttpError(401, 'UNAUTHORIZED', 'Authentication required');
  }
}
