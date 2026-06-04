import {
  createCommentSchema,
  createTaskSchema,
  updateTaskSchema,
  type CommentDTO,
  type TaskDTO,
} from '@project-manager/shared';
import { and, eq } from 'drizzle-orm';
import { comments, projects, tasks, users } from '../db/schema.js';
import { getDb } from '../lib/db.js';
import { HttpError } from '../lib/http-error.js';
import { assertProjectOwner, assertTaskOwner } from '../lib/task-access.js';
import { toCommentDto, toTaskDto } from '../lib/task-mapper.js';

/** Lists tasks for a project owned by the user */
export async function listTasksByProject(projectId: string, ownerId: string): Promise<TaskDTO[]> {
  await assertProjectOwner(projectId, ownerId);

  const db = getDb();
  const rows = await db.select().from(tasks).where(eq(tasks.projectId, projectId));

  const result: TaskDTO[] = [];

  for (const task of rows) {
    const executor = await db.select().from(users).where(eq(users.id, task.executorId)).get();

    result.push(toTaskDto(task, executor ?? null));
  }

  return result;
}

/** Lists tasks assigned to the user on their own projects */
export async function listTasksForUser(ownerId: string): Promise<TaskDTO[]> {
  const db = getDb();

  const rows = await db
    .select({ task: tasks, project: projects })
    .from(tasks)
    .innerJoin(projects, eq(tasks.projectId, projects.id))
    .where(and(eq(projects.ownerId, ownerId), eq(tasks.executorId, ownerId)));

  const result: TaskDTO[] = [];

  for (const { task } of rows) {
    const executor = await db.select().from(users).where(eq(users.id, task.executorId)).get();

    result.push(toTaskDto(task, executor ?? null));
  }

  return result;
}

/** Returns task detail with comments */
export async function getTaskById(taskId: string, ownerId: string): Promise<TaskDTO> {
  const task = await assertTaskOwner(taskId, ownerId);
  const db = getDb();

  const executor = await db.select().from(users).where(eq(users.id, task.executorId)).get();
  const commentRows = await db.select().from(comments).where(eq(comments.taskId, taskId));

  const taskComments = await Promise.all(commentRows.map(async (comment) => {
    const author = await db.select().from(users).where(eq(users.id, comment.authorId)).get();

    if (!author) {
      throw new HttpError(500, 'INTERNAL_ERROR', 'Comment author not found');
    }

    return { comment, author };
  }));

  return toTaskDto(task, executor ?? null, taskComments);
}

/** Creates a task in an owned project */
export async function createTask(
  projectId: string,
  ownerId: string,
  input: unknown,
): Promise<TaskDTO> {
  await assertProjectOwner(projectId, ownerId);

  const data = createTaskSchema.parse(input);
  const db = getDb();

  const assigneeId = data.assigneeId ?? ownerId;
  const executorId = data.executorId ?? ownerId;

  const [task] = await db.insert(tasks).values({
    projectId,
    assigneeId,
    executorId,
    title: data.title,
    description: data.description,
    deadline: data.deadline,
    status: data.status ?? 'TODO',
  }).returning();

  const executor = await db.select().from(users).where(eq(users.id, task.executorId)).get();

  return toTaskDto(task, executor ?? null, []);
}

/** Updates a task in an owned project */
export async function updateTask(
  taskId: string,
  ownerId: string,
  input: unknown,
): Promise<TaskDTO> {
  const data = updateTaskSchema.parse(input);

  if (Object.keys(data).length === 0) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'No fields to update');
  }

  await assertTaskOwner(taskId, ownerId);

  const db = getDb();
  const [task] = await db.update(tasks).set(data).where(eq(tasks.id, taskId)).returning();

  return getTaskById(task.id, ownerId);
}

/** Deletes a task */
export async function deleteTask(taskId: string, ownerId: string): Promise<void> {
  await assertTaskOwner(taskId, ownerId);

  const db = getDb();

  await db.delete(tasks).where(eq(tasks.id, taskId));
}

/** Lists comments for a task */
export async function listComments(taskId: string, ownerId: string): Promise<CommentDTO[]> {
  await assertTaskOwner(taskId, ownerId);

  const db = getDb();
  const commentRows = await db.select().from(comments).where(eq(comments.taskId, taskId));

  const result: CommentDTO[] = [];

  for (const comment of commentRows) {
    const author = await db.select().from(users).where(eq(users.id, comment.authorId)).get();

    if (!author) {
      throw new HttpError(500, 'INTERNAL_ERROR', 'Comment author not found');
    }

    result.push(toCommentDto(comment, author));
  }

  return result;
}

/** Adds a comment to a task */
export async function createComment(
  taskId: string,
  authorId: string,
  input: unknown,
): Promise<CommentDTO> {
  await assertTaskOwner(taskId, authorId);

  const data = createCommentSchema.parse(input);
  const db = getDb();

  const [comment] = await db.insert(comments).values({
    taskId,
    authorId,
    text: data.text,
  }).returning();

  const author = await db.select().from(users).where(eq(users.id, authorId)).get();

  if (!author) {
    throw new HttpError(500, 'INTERNAL_ERROR', 'Comment author not found');
  }

  return toCommentDto(comment, author);
}

/** Deletes a comment (author only) */
export async function deleteComment(commentId: string, userId: string): Promise<void> {
  const db = getDb();
  const comment = await db.select().from(comments).where(eq(comments.id, commentId)).get();

  if (!comment) {
    throw new HttpError(404, 'NOT_FOUND', 'Comment not found');
  }

  if (comment.authorId !== userId) {
    throw new HttpError(403, 'FORBIDDEN', 'You can only delete your own comments');
  }

  await assertTaskOwner(comment.taskId, userId);

  await db.delete(comments).where(eq(comments.id, commentId));
}
