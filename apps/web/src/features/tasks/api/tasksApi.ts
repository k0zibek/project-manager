import type {
  CommentDTO,
  CreateCommentInput,
  CreateTaskInput,
  TaskDTO,
  UpdateTaskInput,
} from '@project-manager/shared';

import { apiFetch } from 'shared/api/client';

type TasksResponse = { tasks: TaskDTO[] };
type TaskResponse = { task: TaskDTO };
type CommentResponse = { comment: CommentDTO };

/** Fetches tasks for a project */
export const fetchProjectTasksApi = (projectId: string) => apiFetch<TasksResponse>(`/projects/${projectId}/tasks`);

/** Fetches current user's tasks */
export const fetchMyTasksApi = () => apiFetch<TasksResponse>('/tasks');

/** Fetches task detail with comments */
export const fetchTaskApi = (taskId: string) => apiFetch<TaskResponse>(`/tasks/${taskId}`);

/** Creates a task in a project */
export const createTaskApi = (projectId: string, data: CreateTaskInput) => apiFetch<TaskResponse>(
  `/projects/${projectId}/tasks`,
  { method: 'POST', body: data },
);

/** Updates a task */
export const updateTaskApi = (taskId: string, data: UpdateTaskInput) => apiFetch<TaskResponse>(
  `/tasks/${taskId}`,
  { method: 'PATCH', body: data },
);

/** Deletes a task */
export const deleteTaskApi = (taskId: string) => apiFetch<void>(`/tasks/${taskId}`, { method: 'DELETE' });

/** Creates a comment */
export const createCommentApi = (taskId: string, data: CreateCommentInput) => apiFetch<CommentResponse>(
  `/tasks/${taskId}/comments`,
  { method: 'POST', body: data },
);

/** Deletes a comment */
export const deleteCommentApi = (commentId: string) => apiFetch<void>(`/comments/${commentId}`, { method: 'DELETE' });
