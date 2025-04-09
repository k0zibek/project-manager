// libraries
import {
  type ChangeEvent, type FC, useEffect, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button, Card,
  Divider,
  Intent, Spinner,
} from '@blueprintjs/core';
// actions
import { fetchUserProfile } from 'context/actions/auth/authThunks';
import { deleteTask, fetchTaskComments, updateTask } from 'context/actions/task/taskThunks';
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
import type { AppDispatch, RootState } from 'context/store';
// hooks
import { useToasterContext } from 'hooks/ToasterProvider/useToasterProvider';

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
  const dispatch = useDispatch<AppDispatch>();
  const { taskId } = useParams();
  const { currentTask, loading, error } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);
  const [files, setFiles] = useState<File[] | null>(null);
  const [fileStatus, setFileStatus] = useState<UploadStatusType>('idle');

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }

    if (!taskId) {
      return;
    }

    dispatch(fetchTaskComments(taskId));
  }, [
    dispatch,
    taskId,
    user,
  ]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...e.target.files]);
    }
  };

  const handleFileUpload = async () => {
    if (!files) {
      return;
    }

    setFileStatus('uploading');

    const formData = new FormData();

    files.forEach((file, i) => {
      formData.append(`file-${i}`, file, file.name);
    });

    try {
      await dispatch(updateTask(taskId, { files: [formData] }));

      toaster?.show({ message: 'Файл загружен', intent: 'success' });

      setFileStatus('success');

      await dispatch(fetchTaskComments(taskId));
    } catch (err) {
      toaster?.show({ message: `Ошибка при загрузке файла: ${err}`, intent: 'danger' });

      setFileStatus('error');
    }
  };

  const handleFileDelete = (fileName: string) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  const handleBack = () => {
    if (location.key === 'default') {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTask(Number(taskId)));

      handleBack();

      toaster?.show({ message: 'Задача удалена', intent: 'success' });
    } catch (err) {
      toaster?.show({ message: `Ошибка при удалении задачи: ${err}`, intent: 'danger' });
    }
  };

  const handleStatusSubmit = async (status: ITaskStatus) => {
    try {
      await dispatch(updateTask(taskId, { status }));

      await dispatch(fetchTaskComments(taskId));

      toaster?.show({ message: 'Статус задачи изменен', intent: 'success' });
    } catch (err) {
      toaster?.show({ message: `Ошибка при изменении статуса задачи: ${err}`, intent: 'danger' });
    }
  };

  if (loading || !currentTask?.comments) {
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
    <div className="task-detail-container">
      <div className="task-header">
        <Button icon="arrow-left" minimal onClick={handleBack} text="Назад" />

        <h1 className="task-header-title">{currentTask?.title}</h1>

        <div className="task-btn-container">
          <ButtonWithDialogForm
            buttonText="Изменить статус"
            dialogTitle="Статус"
            fields={TASK_STATUS_FIELDS}
            intent={Intent.PRIMARY}
            onSubmit={handleStatusSubmit}
            validationSchema={TASK_STATUS_VALIDATION_SCHEMA}
          />

          { currentTask.executorId === user?.id
            ? (
              <ButtonWithDialog
                buttonText="Удалить"
                dialogTitle="Вы уверены?"
                handleClick={handleDelete}
                intent={Intent.DANGER}
              />
            )
            : null}
        </div>
      </div>

      <Divider />

      <Card className="task-detail-card">
        <p>
          <strong>📝 Описание задачи:</strong>
          {` ${currentTask?.description}`}
        </p>

        <p>
          <strong>🏷️ Исполнитель:</strong>
          {` ${currentTask?.executor?.name}`}
        </p>

        <p>
          <strong>📅 Дедлайн:</strong>
          {` ${currentTask?.deadline}`}
        </p>

        <p>
          <strong>
            {`${currentTask?.status === 'DONE' ? '✅' : '🔄'} Статус: `}
          </strong>
          {taskStatus(currentTask?.status)}
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

      <TaskComments comments={currentTask?.comments} />
    </div>
  );
};
