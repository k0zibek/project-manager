import type { ProjectsState } from 'constants/types';

export const INITIAL_PROJECT_STATE: ProjectsState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};
