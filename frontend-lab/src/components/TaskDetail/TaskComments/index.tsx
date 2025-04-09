// libraries
import { type FC, useState } from 'react';
import { type FieldValues, type SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Button, Card, Intent, Spinner,
} from '@blueprintjs/core';
// actions
import { deleteComment, fetchTaskComments, postComment } from 'context/actions/task/taskThunks';
// components
import { FormInputField } from 'components/shared/FormInputField';
// constants
import { type IComment } from 'constants/types';
// store
import type { AppDispatch, RootState } from 'context/store';
// hooks
import { useToasterContext } from 'hooks/ToasterProvider/useToasterProvider';

interface TaskCommentProps {
  comments: IComment[];
}

export const TaskComments: FC<TaskCommentProps> = ({ comments }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toaster } = useToasterContext();
  const { taskId } = useParams();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handlePostComment: SubmitHandler<FieldValues> = async (value: FieldValues) => {
    if (!value.comment.trim()) {
      return;
    }

    try {
      setIsLoading(true);

      const comment: Omit<IComment, 'id'> = {
        taskId: Number(taskId),
        text: value.comment,
        author: {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
      };

      await dispatch(postComment(comment));

      await dispatch(fetchTaskComments(taskId));
    } catch (err) {
      toaster?.show({ message: `Ошибка добавления комментария: ${err}`, intent: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await dispatch(deleteComment(commentId));

      toaster?.show({ message: 'Комментарий удален', intent: 'success' });
    } catch (err) {
      toaster?.show({ message: `Ошибка удаления комментария: ${err}`, intent: 'danger' });
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <Spinner
          aria-label="Loading..."
          intent={Intent.NONE}
          size={35}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        {`Ошибка загрузки задачи с сервера: ${error}`}
      </div>
    );
  }

  return (
    <div className="task-comments">
      <h2>💬 Комментарии</h2>

      <form className="comment-form" onSubmit={handleSubmit(handlePostComment)}>
        <FormInputField
          control={control}
          error={errors.email?.message}
          name="comment"
          placeholder="Ваш комментарий"
          type="text"
        />

        <Button intent={Intent.PRIMARY} loading={isLoading} text="Оставить комментарий" type="submit" />
      </form>

      {
          comments.length > 0 ? comments.map((comment) => (
            <Card key={comment.id} className="task-comment-card">
              <img alt="ava" className="avatar-img" loading="lazy" src={comment.author.avatarUrl} />

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
                    {comment.createdAt}
                  </p>
                </div>

                { comment.author.id === user?.id
                  ? <Button icon="trash" intent={Intent.DANGER} minimal onClick={() => handleDeleteComment(comment.id)} />
                  : null}
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
