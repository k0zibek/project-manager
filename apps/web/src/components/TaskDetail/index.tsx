// libraries
import {
  type ChangeEvent, type FC, useState,
} from 'react';
import { useSelector } from 'react-redux';
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
  BYTE,
  FIXED_VALUE,
  TASK_STATUS_FIELDS,
  TASK_STATUS_VALIDATION_SCHEMA,
  type UploadStatusType,
} from 'components/TaskDetail/config';
// store
import type { RootState } from 'context/store';
import { useToasterContext } from 'hooks/ToasterProvider/useToasterProvider';
// hooks
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
  const { user } = useSelector((state: RootState) => state.auth);
  const [files, setFiles] = useState<File[] | null>(null);
  const [fileStatus, setFileStatus] = useState<UploadStatusType>('idle');

  const {
    data: task,
    isLoading,
    isError,
    error,
  } = useTask(taskId);

  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask(projectId);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...e.target.files]);
    }
  };

  const handleFileUpload = () => {
    toaster?.show({ message: 'Загрузка файлов будет доступна позже', intent: 'warning' });
    setFileStatus('idle');
  };

  const handleFileDelete = (fileName: string) => {
    setFiles((prev) => prev?.filter((file) => file.name !== fileName) ?? null);
  };

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
  const canDelete = user && task.executorId === user.id;

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

      <Card className="task-files">
        <h2>📎 Файлы</h2>

        <div className="task-files-btn-container">
          <Button text="Список файлов" />

          <label className="file-upload-btn" htmlFor="file-upload-input">
            Выбрать файлы
          </label>
          <input
            accept="image/jpeg"
            id="file-upload-input"
            multiple
            onChange={handleFileChange}
            placeholder="Выбрать"
            type="file"
          />
        </div>

        <div>
          {files && files.map((file, index) => (
            <Card key={file.name} className="file-info">
              <div>
                <p>
                  <strong>
                    {`${index + 1}. ${file.name}`}
                  </strong>
                </p>

                <p>
                  {`Размер файла: ${(file.size / BYTE).toFixed(FIXED_VALUE)} KB`}
                </p>

                <p>
                  {`Тип файла: ${file.type}`}
                </p>
              </div>

              <Button icon="delete" intent={Intent.DANGER} minimal onClick={() => handleFileDelete(file.name)} />
            </Card>
          ))}

          {files && files.length > 0
              && fileStatus !== 'uploading'
              && <Button onClick={handleFileUpload} text="Загрузить" />}

          {fileStatus === 'success' && <p className="success-container">Файлы успешно загружены!</p>}

          {fileStatus === 'error' && <p className="error-container">Ошибка попробуйте позже</p>}
        </div>
      </Card>

      <Divider />

      <TaskComments comments={task.comments ?? []} projectId={projectId} />
    </div>
  );
};
