import type {
  IComment,
  ITask, ITaskUser, IUser,
} from 'constants/types';

import { legacyApiFetch } from 'shared/api/legacyClient';

const extractUserData = (user: IUser): ITaskUser | null => {
  if (!user) {
    return null;
  }

  return { id: user.id, name: user.name, avatarUrl: user.avatarUrl };
};

export const getAllTasksApi = async (projectId: string) => legacyApiFetch<ITask[]>(`/tasks?projectId=${projectId}`) ?? null;

export const getTaskByIdApi = async (taskId: string) => ({
  data: await legacyApiFetch<ITask>(`/tasks/${taskId}`),
});

export const updateTaskApi = async (taskId: string, data: Partial<ITask>) => {
  const { data: existingTask } = await getTaskByIdApi(taskId);
  const updatedTask = { ...existingTask, ...data };

  return {
    data: await legacyApiFetch<ITask>(`/tasks/${taskId}`, { method: 'PUT', body: updatedTask }),
  };
};

export const postTaskApi = async (data: Omit<ITask, 'id'>) => ({
  data: await legacyApiFetch<ITask>('/tasks', { method: 'POST', body: data }),
});

export const getTaskCommentsApi = async (taskId: string) => {
  const { data: task } = await getTaskByIdApi(taskId);

  if (!task.executorId) {
    return null;
  }

  const commentsPromise = legacyApiFetch<IComment[]>(`/comments?taskId=${taskId}`);
  const userPromise = legacyApiFetch<IUser>(`/users/${task.executorId}`);
  const [comments, user] = await Promise.all([commentsPromise, userPromise]);

  return {
    ...task,
    executor: extractUserData(user),
    comments,
  };
};

export const getUserTasksApi = async (userId: number) => legacyApiFetch<ITask[]>(`/tasks?executorId=${userId}`) ?? null;

export const deleteTaskApi = async (taskId: number) => legacyApiFetch<void>(`/tasks/${taskId}`, { method: 'DELETE' });

export const postCommentApi = async (data: Omit<IComment, 'id'>) => ({
  data: await legacyApiFetch<IComment>('/comments', { method: 'POST', body: data }),
});

export const deleteCommentApi = async (commentId: number) => legacyApiFetch<void>(`/comments/${commentId}`, { method: 'DELETE' });
