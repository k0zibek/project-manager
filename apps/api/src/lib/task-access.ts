import { eq } from 'drizzle-orm';
import { projects, tasks } from '../db/schema.js';
import { getDb } from './db.js';
import { HttpError } from './http-error.js';

/** Loads a project and verifies the user is the owner */
export async function assertProjectOwner(projectId: string, ownerId: string) {
  const db = getDb();
  const project = await db.select().from(projects).where(eq(projects.id, projectId)).get();

  if (!project) {
    throw new HttpError(404, 'NOT_FOUND', 'Project not found');
  }

  if (project.ownerId !== ownerId) {
    throw new HttpError(403, 'FORBIDDEN', 'You do not have access to this project');
  }

  return project;
}

/** Loads a task and verifies the user owns its project */
export async function assertTaskOwner(taskId: string, ownerId: string) {
  const db = getDb();
  const row = await db
    .select({ task: tasks, project: projects })
    .from(tasks)
    .innerJoin(projects, eq(tasks.projectId, projects.id))
    .where(eq(tasks.id, taskId))
    .get();

  if (!row) {
    throw new HttpError(404, 'NOT_FOUND', 'Task not found');
  }

  if (row.project.ownerId !== ownerId) {
    throw new HttpError(403, 'FORBIDDEN', 'You do not have access to this project');
  }

  return row.task;
}
