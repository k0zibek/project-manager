import type { FastifyPluginAsync } from 'fastify';
import type { Env } from '../config/env.js';
import { requireAuth } from '../middleware/require-auth.js';
import * as tasksService from '../services/tasks.service.js';

type TaskRouteOptions = {
  env: Env;
};

/** Task and comment routes (project-owner scoped) */
export const taskRoutes: FastifyPluginAsync<TaskRouteOptions> = async (app, opts) => {
  const { env } = opts;

  app.get('/tasks', async (request, reply) => {
    const ownerId = await requireAuth(request, reply, env);
    const tasks = await tasksService.listTasksForUser(ownerId);

    return { tasks };
  });

  app.get('/projects/:projectId/tasks', async (request, reply) => {
    const ownerId = await requireAuth(request, reply, env);
    const { projectId } = request.params as { projectId: string };
    const tasks = await tasksService.listTasksByProject(projectId, ownerId);

    return { tasks };
  });

  app.post('/projects/:projectId/tasks', async (request, reply) => {
    const ownerId = await requireAuth(request, reply, env);
    const { projectId } = request.params as { projectId: string };
    const task = await tasksService.createTask(projectId, ownerId, request.body);

    return reply.status(201).send({ task });
  });

  app.get('/tasks/:id', async (request, reply) => {
    const ownerId = await requireAuth(request, reply, env);
    const { id } = request.params as { id: string };
    const task = await tasksService.getTaskById(id, ownerId);

    return { task };
  });

  app.patch('/tasks/:id', async (request, reply) => {
    const ownerId = await requireAuth(request, reply, env);
    const { id } = request.params as { id: string };
    const task = await tasksService.updateTask(id, ownerId, request.body);

    return { task };
  });

  app.delete('/tasks/:id', async (request, reply) => {
    const ownerId = await requireAuth(request, reply, env);
    const { id } = request.params as { id: string };

    await tasksService.deleteTask(id, ownerId);

    return reply.status(204).send();
  });

  app.get('/tasks/:taskId/comments', async (request, reply) => {
    const ownerId = await requireAuth(request, reply, env);
    const { taskId } = request.params as { taskId: string };
    const comments = await tasksService.listComments(taskId, ownerId);

    return { comments };
  });

  app.post('/tasks/:taskId/comments', async (request, reply) => {
    const ownerId = await requireAuth(request, reply, env);
    const { taskId } = request.params as { taskId: string };
    const comment = await tasksService.createComment(taskId, ownerId, request.body);

    return reply.status(201).send({ comment });
  });

  app.delete('/comments/:id', async (request, reply) => {
    const ownerId = await requireAuth(request, reply, env);
    const { id } = request.params as { id: string };

    await tasksService.deleteComment(id, ownerId);

    return reply.status(204).send();
  });
};
