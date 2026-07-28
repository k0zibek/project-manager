import {
  createCommentSchema,
  createTaskSchema,
  updateTaskSchema,
  type CommentDTO,
  type TaskDTO,
} from '@project-manager/shared';
import { eq } from 'drizzle-orm';
import { comments, projects, tasks, users } from '../db/schema.js';
import { getDb } from '../lib/db.js';
import { HttpError } from '../lib/http-error.js';
import { assertProjectOwner, assertTaskOwner } from '../lib/task-access.js';
import { toCommentDto, toTaskDto } from '../lib/task-mapper.js';

/** Lists tasks for a project owned by the user */
export async function listTasksByProject(projectId: string, ownerId: string): Promise<TaskDTO[]> {
  await assertProjectOwner(projectId, ownerId);

  const db = getDb();
  const rows = await db
    .select({ task: tasks, executor: users })
    .from(tasks)
    .innerJoin(users, eq(tasks.executorId, users.id))
    .where(eq(tasks.projectId, projectId));

  return rows.map(({ task, executor }) => toTaskDto(task, executor));
}

/** Lists tasks in all projects owned by the user */
export async function listTasksForUser(ownerId: string): Promise<TaskDTO[]> {
  const db = getDb();

  const rows = await db
    .select({ task: tasks, executor: users })
    .from(tasks)
    .innerJoin(projects, eq(tasks.projectId, projects.id))
    .innerJoin(users, eq(tasks.executorId, users.id))
    .where(eq(projects.ownerId, ownerId));

  return rows.map(({ task, executor }) => toTaskDto(task, executor));
}

/** Returns task detail with comments */
export async function getTaskById(taskId: string, ownerId: string): Promise<TaskDTO> {
  const task = await assertTaskOwner(taskId, ownerId);
  const db = getDb();

  const executor = await db.select().from(users).where(eq(users.id, task.executorId)).get();
  const commentRows = await db
    .select({ comment: comments, author: users })
    .from(comments)
    .innerJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.taskId, taskId));

  return toTaskDto(task, executor ?? null, commentRows);
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
  const rows = await db
    .select({ comment: comments, author: users })
    .from(comments)
    .innerJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.taskId, taskId));

  return rows.map(({ comment, author }) => toCommentDto(comment, author));
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

  return toCommentDto(comment, author!);
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
