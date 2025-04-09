export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
}

export interface ITaskUser {
  id: number;
  name: string;
  avatarUrl: string;
}

export interface IComment {
  id: number;
  taskId: number;
  text: string;
  author: ITaskUser | null;
  createdAt?: string;
}

export type ITaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface ITask {
  id: number;
  projectId: number;
  assigneeId: number;
  executorId: number;
  title: string;
  description: string;
  deadline: string;
  status: ITaskStatus;
  files: FormData[];
  createdAt?: string;
  executor?: ITaskUser | null;
  comments?: IComment[];
}

export interface IProject {
  id: number;
  name: string;
  description: string;
}

export interface AuthState {
  user: IUser | null;
  userId: number | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ProjectsState {
  projects: IProject[];
  currentProject: IProject | null;
  loading: boolean;
  error: string | null;
}

export interface TasksState {
  tasks: ITask[];
  currentTask: ITask | null;
  userTasks: ITask[];
  loading: boolean;
  error: string | null;
}

export interface LoginFormInputs {
  email?: string;
  password?: string;
}

export interface IColumn {
  id: string;
  title: string;
}

export interface FieldDefinition {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'date' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
}
