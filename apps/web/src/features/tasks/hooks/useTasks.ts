import type { CreateCommentInput, CreateTaskInput, UpdateTaskInput } from '@project-manager/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { projectKeys } from 'features/projects/queryKeys';
import {
  createCommentApi,
  createTaskApi,
  deleteCommentApi,
  deleteTaskApi,
  fetchMyTasksApi,
  fetchProjectTasksApi,
  fetchTaskApi,
  updateTaskApi,
} from 'features/tasks/api/tasksApi';
import { taskKeys } from 'features/tasks/queryKeys';

/** Loads tasks for a Kanban board */
export function useProjectTasks(projectId: string | undefined) {
  return useQuery({
    queryKey: taskKeys.project(projectId ?? ''),
    queryFn: async () => {
      const { tasks } = await fetchProjectTasksApi(projectId!);

      return tasks;
    },
    enabled: Boolean(projectId),
  });
}

/** Loads tasks assigned to the current user */
export function useMyTasks(enabled = true) {
  return useQuery({
    queryKey: taskKeys.mine(),
    queryFn: async () => {
      const { tasks } = await fetchMyTasksApi();

      return tasks;
    },
    enabled,
  });
}

/** Loads task detail with comments */
export function useTask(taskId: string | undefined) {
  return useQuery({
    queryKey: taskKeys.detail(taskId ?? ''),
    queryFn: async () => {
      const { task } = await fetchTaskApi(taskId!);

      return task;
    },
    enabled: Boolean(taskId),
  });
}

/** Creates a task in a project */
export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => createTaskApi(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.project(projectId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.mine() });
    },
  });
}

/** Updates a task (status, fields) */
export function useUpdateTask(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskInput }) => updateTaskApi(taskId, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) });

      if (projectId) {
        queryClient.invalidateQueries({ queryKey: taskKeys.project(projectId) });
      } else {
        queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      }

      queryClient.invalidateQueries({ queryKey: taskKeys.mine() });
    },
  });
}

/** Deletes a task */
export function useDeleteTask(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTaskApi(taskId),
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: taskKeys.project(projectId) });
        queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      }

      queryClient.invalidateQueries({ queryKey: taskKeys.mine() });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

/** Adds a comment to a task */
export function useCreateComment(taskId: string, projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentInput) => createCommentApi(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });

      if (projectId) {
        queryClient.invalidateQueries({ queryKey: taskKeys.project(projectId) });
      }
    },
  });
}

/** Deletes a comment */
export function useDeleteComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteCommentApi(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    },
  });
}
