import type { CreateProjectInput, ProjectDTO, UpdateProjectInput } from '@project-manager/shared';

import { apiFetch } from 'shared/api/client';

type ProjectsResponse = { projects: ProjectDTO[] };
type ProjectResponse = { project: ProjectDTO };

/** Fetches projects for the current user */
export const fetchProjectsApi = () => apiFetch<ProjectsResponse>('/projects');

/** Fetches a single project by id */
export const fetchProjectApi = (projectId: string) => apiFetch<ProjectResponse>(`/projects/${projectId}`);

/** Creates a project */
export const createProjectApi = (data: CreateProjectInput) => apiFetch<ProjectResponse>('/projects', {
  method: 'POST',
  body: data,
});

/** Updates a project */
export const updateProjectApi = (projectId: string, data: UpdateProjectInput) => apiFetch<ProjectResponse>(
  `/projects/${projectId}`,
  { method: 'PATCH', body: data },
);

/** Deletes a project */
export const deleteProjectApi = (projectId: string) => apiFetch<void>(`/projects/${projectId}`, {
  method: 'DELETE',
});
