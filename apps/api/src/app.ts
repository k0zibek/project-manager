import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import Fastify from 'fastify';
import type { Env } from './config/env.js';
import { HttpError } from './lib/http-error.js';
import { authRoutes } from './routes/auth.js';
import { healthRoutes } from './routes/health.js';
import { projectRoutes } from './routes/projects.js';
import { taskRoutes } from './routes/tasks.js';

/** Builds configured Fastify instance */
export function buildApp(env: Env) {
  const app = Fastify({
    logger: env.NODE_ENV !== 'test',
  });

  app.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  app.register(cookie, {
    secret: env.COOKIE_SECRET,
  });

  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error);

    if (error instanceof HttpError) {
      return reply.status(error.statusCode).send({
        error: { code: error.code, message: error.message },
      });
    }

    const fastifyError = error as { statusCode?: number; message?: string; code?: string };
    const statusCode = fastifyError.statusCode ?? 500;
    const message = statusCode >= 500 ? 'Internal server error' : fastifyError.message ?? 'Request failed';

    return reply.status(statusCode).send({
      error: {
        code: fastifyError.code ?? 'INTERNAL_ERROR',
        message,
      },
    });
  });

  app.register(healthRoutes);
  app.register(authRoutes, { env });
  app.register(projectRoutes, { env });
  app.register(taskRoutes, { env });

  return app;
}
