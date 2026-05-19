import type { TasksState } from 'constants/types';

export const INITIAL_TASK_STATE: TasksState = {
  tasks: [],
  currentTask: null,
  userTasks: [],
  loading: false,
  error: null,
};
