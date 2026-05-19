import type { IProject } from 'constants/types';

import { legacyApiFetch } from 'shared/api/legacyClient';

export const getAllProjectsApi = async () => ({
  data: await legacyApiFetch<IProject[]>('/projects'),
});

export const getProjectByIdApi = async (projectId: string) => ({
  data: await legacyApiFetch<IProject>(`/projects/${projectId}`),
});

export const createProjectApi = async (data: Omit<IProject, 'id'>) => ({
  data: await legacyApiFetch<IProject>('/projects', { method: 'POST', body: data }),
});
