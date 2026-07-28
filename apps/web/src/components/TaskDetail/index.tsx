// libraries
import { type FC } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button, Card,
  Divider,
  Intent, Spinner,
} from '@blueprintjs/core';
// components
import { ButtonWithDialog } from 'components/shared/ButtonWithDialog';
import { ButtonWithDialogForm } from 'components/shared/ButtonWithDialogForm';
import { TaskComments } from 'components/TaskDetail/TaskComments';
// constants
import type { ITaskStatus } from 'constants/types';
// config
import {
  TASK_STATUS_FIELDS,
  TASK_STATUS_VALIDATION_SCHEMA,
} from 'components/TaskDetail/config';
import { useToasterContext } from 'hooks/ToasterProvider/useToasterProvider';
// hooks
import { useMe } from 'features/auth/hooks/useAuth';
import { useDeleteTask, useTask, useUpdateTask } from 'features/tasks/hooks/useTasks';

import { format } from 'date-fns';
import { getErrorMessage } from 'shared/errors/getErrorMessage';

const taskStatus = (status: string) => {
  if (status === 'IN_PROGRESS') {
    return 'In Progress';
  }
  if (status === 'TODO') {
    return 'To do';
  }

  return 'Done';
};

export const TaskDetail: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toaster } = useToasterContext();
  const { taskId, projectId } = useParams();
  const { data: user } = useMe();

  const {
    data: task,
    isLoading,
    isError,
    error,
  } = useTask(taskId);

  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask(projectId);

  const handleBack = () => {
    if (location.key === 'default') {
      navigate(projectId ? `/project/${projectId}` : '/');
    } else {
      navigate(-1);
    }
  };

  const handleDelete = async () => {
    if (!taskId) {
      return;
    }

    try {
      await deleteTask.mutateAsync(taskId);

      handleBack();

      toaster?.show({ message: 'Задача удалена', intent: 'success' });
    } catch (err) {
      toaster?.show({ message: `Ошибка при удалении задачи: ${getErrorMessage(err)}`, intent: 'danger' });
    }
  };

  const handleStatusSubmit = async (values: Record<string, string>) => {
    if (!taskId || !values.status) {
      return;
    }

    try {
      await updateTask.mutateAsync({
        taskId,
        data: { status: values.status as ITaskStatus },
      });

      toaster?.show({ message: 'Статус задачи изменен', intent: 'success' });
    } catch (err) {
      toaster?.show({ message: `Ошибка при изменении статуса задачи: ${getErrorMessage(err)}`, intent: 'danger' });
    }
  };

  if (isLoading || !task) {
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

  if (isError) {
    const message = getErrorMessage(error, 'Не удалось загрузить задачу');

    return (
      <div className="error-container">
        {`Ошибка загрузки задачи с сервера: ${message}`}
      </div>
    );
  }

  const deadlineLabel = format(new Date(task.deadline), 'yyyy-MM-dd');
  // The API only ever returns a task here if the caller owns its project (assertTaskOwner),
  // so reaching this page already implies delete permission — no separate field to check.
  const canDelete = Boolean(user);

  return (
    <div className="task-detail-container">
      <div className="task-header">
        <Button icon="arrow-left" minimal onClick={handleBack} text="Назад" />

        <h1 className="task-header-title">{task.title}</h1>

        <div className="task-btn-container">
          <ButtonWithDialogForm
            buttonText="Изменить статус"
            dialogTitle="Статус"
            fields={TASK_STATUS_FIELDS}
            intent={Intent.PRIMARY}
            onSubmit={handleStatusSubmit}
            validationSchema={TASK_STATUS_VALIDATION_SCHEMA}
          />

          {canDelete ? (
            <ButtonWithDialog
              buttonText="Удалить"
              dialogTitle="Вы уверены?"
              handleClick={handleDelete}
              intent={Intent.DANGER}
            />
          ) : null}
        </div>
      </div>

      <Divider />

      <Card className="task-detail-card">
        <p>
          <strong>📝 Описание задачи:</strong>
          {` ${task.description}`}
        </p>

        <p>
          <strong>🏷️ Исполнитель:</strong>
          {` ${task.executor?.name ?? '—'}`}
        </p>

        <p>
          <strong>📅 Дедлайн:</strong>
          {` ${deadlineLabel}`}
        </p>

        <p>
          <strong>
            {`${task.status === 'DONE' ? '✅' : '🔄'} Статус: `}
          </strong>
          {taskStatus(task.status)}
        </p>
      </Card>

      <Divider />

      <TaskComments comments={task.comments ?? []} projectId={projectId} />
    </div>
  );
};
