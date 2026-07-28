// libraries
import { type FC } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button, Divider, Intent, Spinner,
} from '@blueprintjs/core';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
// components
import { ProjectDetailColumn } from 'components/ProjectDetail/Column';
import { ButtonWithDialogForm } from 'components/shared/ButtonWithDialogForm';
// constants
import type { ITaskStatus } from 'constants/types';
// config
import { COLUMNS, TASK_FIELDS, TASK_VALIDATION_SCHEMA } from 'components/ProjectDetail/config';
import { useToasterContext } from 'hooks/ToasterProvider/useToasterProvider';
// hooks
import { useMe } from 'features/auth/hooks/useAuth';
import { useProject } from 'features/projects/hooks/useProjects';
import { useCreateTask, useProjectTasks, useUpdateTask } from 'features/tasks/hooks/useTasks';

import { getErrorMessage } from 'shared/errors/getErrorMessage';

export const ProjectDetail: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toaster } = useToasterContext();
  const { projectId } = useParams();
  const { data: user } = useMe();

  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
    error: projectError,
  } = useProject(projectId);

  const {
    data: tasks = [],
    isLoading: isTasksLoading,
    isError: isTasksError,
    error: tasksError,
  } = useProjectTasks(projectId);

  const createTask = useCreateTask(projectId ?? '');
  const updateTask = useUpdateTask(projectId);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !projectId) {
      return;
    }

    const taskId = String(active.id);
    const newStatus = over.id as ITaskStatus;

    const task = tasks.find((item) => item.id === taskId);

    if (!task || task.status === newStatus) {
      return;
    }

    try {
      await updateTask.mutateAsync({ taskId, data: { status: newStatus } });
    } catch (err) {
      toaster?.show({ message: `Ошибка при смене статуса: ${getErrorMessage(err)}`, intent: 'danger' });
    }
  };

  const handleTaskSubmit = async (values: Record<string, string>) => {
    if (!projectId) {
      return;
    }

    try {
      await createTask.mutateAsync({
        title: values.title,
        description: values.description,
        deadline: new Date(values.deadline),
      });
    } catch (err) {
      toaster?.show({ message: `Ошибка при добавлении новой задачи: ${getErrorMessage(err)}`, intent: 'danger' });
    }
  };

  const handleBack = () => {
    if (location.key === 'default') {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  if (isProjectLoading || isTasksLoading || !user) {
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

  if (isProjectError || isTasksError) {
    const err = projectError ?? tasksError;
    const message = getErrorMessage(err, 'Не удалось загрузить проект');

    return (
      <div className="error-container">
        {`Ошибка загрузки проекта с сервера: ${message}`}
      </div>
    );
  }

  return (
    <div className="project-container">
      <div className="project-header">
        <Button icon="arrow-left" minimal onClick={handleBack} text="Назад" />

        <h1>{project?.name}</h1>

        <ButtonWithDialogForm
          buttonText="Добавить задачу"
          dialogTitle="Новая задача"
          fields={TASK_FIELDS}
          icon="add"
          onSubmit={handleTaskSubmit}
          validationSchema={TASK_VALIDATION_SCHEMA}
        />
      </div>

      <Divider />

      <div className="project-task-states">
        <DndContext onDragEnd={handleDragEnd}>
          {
            COLUMNS.map((column) => (
              <ProjectDetailColumn
                key={column.id}
                column={column}
                isUpdating={updateTask.isPending}
                tasks={tasks}
              />
            ))
          }
        </DndContext>
      </div>
    </div>
  );
};
