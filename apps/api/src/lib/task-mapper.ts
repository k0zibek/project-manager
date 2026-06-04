import type { CommentDTO, TaskDTO, TaskUserDTO } from '@project-manager/shared';
import type { comments, tasks, users } from '../db/schema.js';

type TaskRow = typeof tasks.$inferSelect;
type UserRow = typeof users.$inferSelect;
type CommentRow = typeof comments.$inferSelect;

/** Maps user row to compact task user DTO */
export function toTaskUserDto(user: UserRow): TaskUserDTO {
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
  };
}

/** Maps DB task row to API DTO */
export function toTaskDto(
  task: TaskRow,
  executor?: UserRow | null,
  taskComments?: Array<{ comment: CommentRow; author: UserRow }>,
): TaskDTO {
  const dto: TaskDTO = {
    id: task.id,
    projectId: task.projectId,
    assigneeId: task.assigneeId,
    executorId: task.executorId,
    title: task.title,
    description: task.description,
    deadline: task.deadline.toISOString(),
    status: task.status,
    createdAt: task.createdAt.toISOString(),
  };

  if (executor) {
    dto.executor = toTaskUserDto(executor);
  }

  if (taskComments) {
    dto.comments = taskComments.map(({ comment, author }) => ({
      id: comment.id,
      taskId: comment.taskId,
      text: comment.text,
      author: toTaskUserDto(author),
      createdAt: comment.createdAt.toISOString(),
    }));
  }

  return dto;
}

/** Maps comment row with author to DTO */
export function toCommentDto(comment: CommentRow, author: UserRow): CommentDTO {
  return {
    id: comment.id,
    taskId: comment.taskId,
    text: comment.text,
    author: toTaskUserDto(author),
    createdAt: comment.createdAt.toISOString(),
  };
}
