import type {
  CommentDTO,
  ProjectDTO,
  TaskDTO,
  TaskUserDTO,
  UserDTO,
} from '@project-manager/shared';

export type IUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
};

export type ITaskUser = TaskUserDTO;

export type IComment = CommentDTO;

export type ITaskStatus = TaskDTO['status'];

export type ITask = TaskDTO;

export type IProject = ProjectDTO;

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  user: UserDTO | null;
  status: AuthStatus;
  error: string | null;
}

export interface LoginFormInputs {
  email: string;
  password: string;
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
