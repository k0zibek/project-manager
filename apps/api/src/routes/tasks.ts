import type { FastifyPluginAsync, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import type { Env } from '../config/env.js';
import { HttpError } from '../lib/http-error.js';
import { requireAuth } from '../middleware/require-auth.js';
import * as tasksService from '../services/tasks.service.js';

type TaskRouteOptions = {
  env: Env;
};

/** Task and comment routes (project-owner scoped) */
export const taskRoutes: FastifyPluginAsync<TaskRouteOptions> = async (app, opts) => {
  const { env } = opts;

  app.get('/tasks', async (request, reply) => {
    try {
      const ownerId = await requireAuth(request, reply, env);
      const tasks = await tasksService.listTasksForUser(ownerId);

      return { tasks };
    } catch (error) {
      return handleTaskError(error, reply);
    }
  });

  app.get('/projects/:projectId/tasks', async (request, reply) => {
    try {
      const ownerId = await requireAuth(request, reply, env);
      const { projectId } = request.params as { projectId: string };
      const tasks = await tasksService.listTasksByProject(projectId, ownerId);

      return { tasks };
    } catch (error) {
      return handleTaskError(error, reply);
    }
  });

  app.post('/projects/:projectId/tasks', async (request, reply) => {
    try {
      const ownerId = await requireAuth(request, reply, env);
      const { projectId } = request.params as { projectId: string };
      const task = await tasksService.createTask(projectId, ownerId, request.body);

      return reply.status(201).send({ task });
    } catch (error) {
      return handleTaskError(error, reply);
    }
  });

  app.get('/tasks/:id', async (request, reply) => {
    try {
      const ownerId = await requireAuth(request, reply, env);
      const { id } = request.params as { id: string };
      const task = await tasksService.getTaskById(id, ownerId);

      return { task };
    } catch (error) {
      return handleTaskError(error, reply);
    }
  });

  app.patch('/tasks/:id', async (request, reply) => {
    try {
      const ownerId = await requireAuth(request, reply, env);
      const { id } = request.params as { id: string };
      const task = await tasksService.updateTask(id, ownerId, request.body);

      return { task };
    } catch (error) {
      return handleTaskError(error, reply);
    }
  });

  app.delete('/tasks/:id', async (request, reply) => {
    try {
      const ownerId = await requireAuth(request, reply, env);
      const { id } = request.params as { id: string };

      await tasksService.deleteTask(id, ownerId);

      return reply.status(204).send();
    } catch (error) {
      return handleTaskError(error, reply);
    }
  });

  app.get('/tasks/:taskId/comments', async (request, reply) => {
    try {
      const ownerId = await requireAuth(request, reply, env);
      const { taskId } = request.params as { taskId: string };
      const comments = await tasksService.listComments(taskId, ownerId);

      return { comments };
    } catch (error) {
      return handleTaskError(error, reply);
    }
  });

  app.post('/tasks/:taskId/comments', async (request, reply) => {
    try {
      const ownerId = await requireAuth(request, reply, env);
      const { taskId } = request.params as { taskId: string };
      const comment = await tasksService.createComment(taskId, ownerId, request.body);

      return reply.status(201).send({ comment });
    } catch (error) {
      return handleTaskError(error, reply);
    }
  });

  app.delete('/comments/:id', async (request, reply) => {
    try {
      const ownerId = await requireAuth(request, reply, env);
      const { id } = request.params as { id: string };

      await tasksService.deleteComment(id, ownerId);

      return reply.status(204).send();
    } catch (error) {
      return handleTaskError(error, reply);
    }
  });
};

function handleTaskError(error: unknown, reply: FastifyReply) {
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
