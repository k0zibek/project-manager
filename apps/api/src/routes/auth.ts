import type { FastifyPluginAsync, FastifyReply } from 'fastify';
import rateLimit from '@fastify/rate-limit';
import { ZodError } from 'zod';
import type { Env } from '../config/env.js';
import { clearAuthCookies, setAuthCookies } from '../lib/cookies.js';
import { HttpError } from '../lib/http-error.js';
import { requireAuth } from '../middleware/require-auth.js';
import * as authService from '../services/auth.service.js';

type AuthRouteOptions = {
  env: Env;
};

/** Auth routes: register, login, logout, me, profile */
export const authRoutes: FastifyPluginAsync<AuthRouteOptions> = async (app, opts) => {
  const { env } = opts;
  const secure = env.NODE_ENV === 'production';

  await app.register(rateLimit, {
    global: false,
  });

  app.post('/auth/register', async (request, reply) => {
    try {
      const result = await authService.registerUser(env, request.body);

      setAuthCookies(reply, result.tokens, secure);

      return reply.status(201).send({ user: result.user });
    } catch (error) {
      return handleAuthError(error, reply);
    }
  });

  app.post('/auth/login', {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '1 minute',
      },
    },
  }, async (request, reply) => {
    try {
      const result = await authService.loginUser(env, request.body);

      setAuthCookies(reply, result.tokens, secure);

      return { user: result.user };
    } catch (error) {
      return handleAuthError(error, reply);
    }
  });

  app.post('/auth/logout', async (_request, reply) => {
    clearAuthCookies(reply);

    return reply.status(204).send();
  });

  app.get('/auth/me', async (request, reply) => {
    try {
      const userId = await requireAuth(request, reply, env);
      const user = await authService.getUserById(userId);

      return { user };
    } catch (error) {
      return handleAuthError(error, reply);
    }
  });

  app.patch('/auth/me', async (request, reply) => {
    try {
      const userId = await requireAuth(request, reply, env);
      const user = await authService.updateProfile(userId, request.body);

      return { user };
    } catch (error) {
      return handleAuthError(error, reply);
    }
  });

  app.patch('/auth/password', async (request, reply) => {
    try {
      const userId = await requireAuth(request, reply, env);

      await authService.changePassword(userId, request.body);

      return reply.status(204).send();
    } catch (error) {
      return handleAuthError(error, reply);
    }
  });
};

function handleAuthError(error: unknown, reply: FastifyReply) {
  if (error instanceof HttpError) {
    return reply.status(error.statusCode).send({
      error: { code: error.code, message: error.message },
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: { code: 'VALIDATION_ERROR', message: error.errors[0]?.message ?? 'Invalid input' },
    });
  }

  throw error;
}
