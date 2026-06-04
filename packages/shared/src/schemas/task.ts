import { z } from 'zod';

export const taskStatusSchema = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);

export const taskUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  deadline: z.coerce.date(),
  status: taskStatusSchema.optional(),
  assigneeId: z.string().uuid().optional(),
  executorId: z.string().uuid().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(5000).optional(),
  deadline: z.coerce.date().optional(),
  status: taskStatusSchema.optional(),
  assigneeId: z.string().uuid().optional(),
  executorId: z.string().uuid().optional(),
});

export const createCommentSchema = z.object({
  text: z.string().min(1).max(2000),
});

export const commentDtoSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  text: z.string(),
  author: taskUserSchema,
  createdAt: z.string().datetime(),
});

export const taskDtoSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  assigneeId: z.string().uuid(),
  executorId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  deadline: z.string().datetime(),
  status: taskStatusSchema,
  createdAt: z.string().datetime(),
  executor: taskUserSchema.nullable().optional(),
  comments: z.array(commentDtoSchema).optional(),
});

export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskUserDTO = z.infer<typeof taskUserSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CommentDTO = z.infer<typeof commentDtoSchema>;
export type TaskDTO = z.infer<typeof taskDtoSchema>;
