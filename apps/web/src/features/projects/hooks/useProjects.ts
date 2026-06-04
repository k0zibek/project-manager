import type { CreateProjectInput, UpdateProjectInput } from '@project-manager/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createProjectApi,
  deleteProjectApi,
  fetchProjectApi,
  fetchProjectsApi,
  updateProjectApi,
} from 'features/projects/api/projectsApi';
import { projectKeys } from 'features/projects/queryKeys';

/** Loads the authenticated user's projects */
export function useProjects(enabled = true) {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: async () => {
      const { projects } = await fetchProjectsApi();

      return projects;
    },
    enabled,
  });
}

/** Loads a single project by id */
export function useProject(projectId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: projectKeys.detail(projectId ?? ''),
    queryFn: async () => {
      const { project } = await fetchProjectApi(projectId!);

      return project;
    },
    enabled: Boolean(projectId) && enabled,
  });
}

/** Creates a project and refreshes the list */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectInput) => createProjectApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.list() });
    },
  });
}

/** Updates a project */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: UpdateProjectInput }) => updateProjectApi(projectId, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.list() });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
    },
  });
}

/** Deletes a project */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProjectApi(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.list() });
    },
  });
}
