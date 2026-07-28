import type {
  CommentDTO,
  TaskDTO,
} from '@project-manager/shared';

export type IComment = CommentDTO;

export type ITaskStatus = TaskDTO['status'];

export type ITask = TaskDTO;

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
