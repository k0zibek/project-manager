import axiosInstance from 'api/axiosInstance';
import type {
  IComment,
  ITask, ITaskUser, IUser,
} from 'constants/types';

const extractUserData = (user: IUser): ITaskUser | null => {
  if (!user) {
    return null;
  }

  return { id: user.id, name: user.name, avatarUrl: user.avatarUrl };
};

export const getAllTasksApi = async (
  projectId: string,
) => {
  const { data } = await axiosInstance.get(`/tasks?projectId=${projectId}`);

  return data || null;
};

export const getTaskByIdApi = async (
  taskId: string,
) => axiosInstance.get(`/tasks/${taskId}`);

export const updateTaskApi = async (
  taskId: string,
  data: Partial<ITask>,
) => {
  const { data: existingTask } = await getTaskByIdApi(taskId);

  const updatedTask = { ...existingTask, ...data };

  return axiosInstance.put(`/tasks/${taskId}`, updatedTask);
};

export const postTaskApi = async (data: Omit<ITask, 'id'>) => axiosInstance.post('/tasks', data);

export const getTaskCommentsApi = async (taskId: string) => {
  const { data: task } = await getTaskByIdApi(taskId);

  if (!task.executorId) {
    return null;
  }

  const [commentsResponse, userResponse] = await Promise.all(
    [axiosInstance.get(`/comments?taskId=${taskId}`), axiosInstance.get(`/users/${task.executorId}`)],
  );

  const extractedUser = extractUserData(userResponse.data);

  const data = { ...task, executor: extractedUser, comments: commentsResponse.data };

  return data || null;
};

export const getUserTasksApi = async (userId: number) => {
  const { data } = await axiosInstance.get(`/tasks?executorId=${userId}`);

  return data || null;
};

export const deleteTaskApi = async (taskId: number) => axiosInstance.delete(`/tasks/${taskId}`);

export const postCommentApi = async (data: Omit<IComment, 'id'>) => axiosInstance.post('/comments', data);

export const deleteCommentApi = async (commentId: number) => axiosInstance.delete(`/comments/${commentId}`);
