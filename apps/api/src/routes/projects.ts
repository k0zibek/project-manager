import type { FastifyPluginAsync } from 'fastify';
import type { Env } from '../config/env.js';
import { requireAuth } from '../middleware/require-auth.js';
import * as projectsService from '../services/projects.service.js';

type ProjectRouteOptions = {
  env: Env;
};

/** Project CRUD routes (owner-scoped) */
export const projectRoutes: FastifyPluginAsync<ProjectRouteOptions> = async (app, opts) => {
  const { env } = opts;

  app.get('/projects', async (request, reply) => {
    const ownerId = await requireAuth(request, reply, env);
    const projects = await projectsService.listProjectsForOwner(ownerId);

    return { projects };
  });

  app.post('/projects', async (request, reply) => {
    const ownerId = await requireAuth(request, reply, env);
    const project = await projectsService.createProject(ownerId, request.body);

    return reply.status(201).send({ project });
  });

  app.get('/projects/:id', async (request, reply) => {
    const ownerId = await requireAuth(request, reply, env);
    const { id } = request.params as { id: string };
    const project = await projectsService.getProjectForOwner(id, ownerId);

    return { project };
  });

  app.patch('/projects/:id', async (request, reply) => {
    const ownerId = await requireAuth(request, reply, env);
    const { id } = request.params as { id: string };
    const project = await projectsService.updateProject(id, ownerId, request.body);

    return { project };
  });

  app.delete('/projects/:id', async (request, reply) => {
    const ownerId = await requireAuth(request, reply, env);
    const { id } = request.params as { id: string };

    await projectsService.deleteProject(id, ownerId);

    return reply.status(204).send();
  });
};
