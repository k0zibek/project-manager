// libraries
import { type FC } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Button, Card, Intent,
} from '@blueprintjs/core';
// components
import { FormInputField } from 'components/shared/FormInputField';
// constants
import { type IComment } from 'constants/types';
// store
import type { RootState } from 'context/store';
import { useToasterContext } from 'hooks/ToasterProvider/useToasterProvider';
// hooks
import { useCreateComment, useDeleteComment } from 'features/tasks/hooks/useTasks';

import { format } from 'date-fns';
import { getErrorMessage } from 'shared/errors/getErrorMessage';

type CommentFormValues = {
  comment: string;
};

interface TaskCommentProps {
  comments: IComment[];
  projectId?: string;
}

/** Task comments list with create/delete */
export const TaskComments: FC<TaskCommentProps> = ({ comments, projectId }) => {
  const { toaster } = useToasterContext();
  const { taskId } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    control, handleSubmit, reset, formState: { errors },
  } = useForm<CommentFormValues>({ defaultValues: { comment: '' } });

  const createComment = useCreateComment(taskId ?? '', projectId);
  const deleteComment = useDeleteComment(taskId ?? '');

  const handlePostComment: SubmitHandler<CommentFormValues> = async (value) => {
    if (!value.comment.trim() || !taskId) {
      return;
    }

    try {
      await createComment.mutateAsync({ text: value.comment.trim() });

      reset({ comment: '' });
    } catch (err) {
      toaster?.show({ message: `Ошибка добавления комментария: ${getErrorMessage(err)}`, intent: 'danger' });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment.mutateAsync(commentId);

      toaster?.show({ message: 'Комментарий удален', intent: 'success' });
    } catch (err) {
      toaster?.show({ message: `Ошибка удаления комментария: ${getErrorMessage(err)}`, intent: 'danger' });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="task-comments">
      <h2>💬 Комментарии</h2>

      <form className="comment-form" onSubmit={handleSubmit(handlePostComment)}>
        <FormInputField
          control={control}
          error={errors.comment?.message}
          name="comment"
          placeholder="Ваш комментарий"
          type="text"
        />

        <Button
          intent={Intent.PRIMARY}
          loading={createComment.isPending}
          text="Оставить комментарий"
          type="submit"
        />
      </form>

      {
          comments.length > 0 ? comments.map((comment) => (
            <Card key={comment.id} className="task-comment-card">
              <img
                alt="ava"
                className="avatar-img"
                loading="lazy"
                src={comment.author.avatarUrl ?? ''}
              />

              <div className="comment-container">
                <div className="task-comment-content">
                  <p className="comment-user">
                    <strong>
                      {`${comment.author.name}:`}
                    </strong>
                    <br />
                    {comment.text}
                  </p>

                  <p className="comment-date">
                    {format(new Date(comment.createdAt), 'dd.MM.yyyy HH:mm')}
                  </p>
                </div>

                {comment.author.id === user.id ? (
                  <Button
                    icon="trash"
                    intent={Intent.DANGER}
                    onClick={() => handleDeleteComment(comment.id)}
                    variant="minimal"
                  />
                ) : null}
              </div>
            </Card>
          )) : (
            <div className="task-comment-card">
              <h3>комментариев нет</h3>
            </div>
          )
      }
    </div>
  );
};
