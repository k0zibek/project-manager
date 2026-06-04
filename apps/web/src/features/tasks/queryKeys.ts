/** TanStack Query keys for tasks */
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  project: (projectId: string) => [
    ...taskKeys.lists(),
    'project',
    projectId,
  ] as const,
  mine: () => [...taskKeys.lists(), 'mine'] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (taskId: string) => [...taskKeys.details(), taskId] as const,
};
