import type { FastifyPluginAsync, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import type { Env } from '../config/env.js';
import { HttpError } from '../lib/http-error.js';
import { requireAuth } from '../middleware/require-auth.js';
import * as projectsService from '../services/projects.service.js';

type ProjectRouteOptions = {
  env: Env;
};

/** Project CRUD routes (owner-scoped) */
export const projectRoutes: FastifyPluginAsync<ProjectRouteOptions> = async (app, opts) => {
  const { env } = opts;

  app.get('/projects', async (request, reply) => {
    try {
      const ownerId = await requireAuth(request, reply, env);
      const projects = await projectsService.listProjectsForOwner(ownerId);

      return { projects };
    } catch (error) {
      return handleProjectError(error, reply);
    }
  });

  app.post('/projects', async (request, reply) => {
    try {
      const ownerId = await requireAuth(request, reply, env);
      const project = await projectsService.createProject(ownerId, request.body);

      return reply.status(201).send({ project });
    } catch (error) {
      return handleProjectError(error, reply);
    }
  });

  app.get('/projects/:id', async (request, reply) => {
    try {
      const ownerId = await requireAuth(request, reply, env);
      const { id } = request.params as { id: string };
      const project = await projectsService.getProjectForOwner(id, ownerId);

      return { project };
    } catch (error) {
      return handleProjectError(error, reply);
    }
  });

  app.patch('/projects/:id', async (request, reply) => {
    try {
      const ownerId = await requireAuth(request, reply, env);
      const { id } = request.params as { id: string };
      const project = await projectsService.updateProject(id, ownerId, request.body);

      return { project };
    } catch (error) {
      return handleProjectError(error, reply);
    }
  });

  app.delete('/projects/:id', async (request, reply) => {
    try {
      const ownerId = await requireAuth(request, reply, env);
      const { id } = request.params as { id: string };

      await projectsService.deleteProject(id, ownerId);

      return reply.status(204).send();
    } catch (error) {
      return handleProjectError(error, reply);
    }
  });
};

function handleProjectError(error: unknown, reply: FastifyReply) {
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
