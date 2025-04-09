// libraries
import { type FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button, Divider, Intent, Spinner,
} from '@blueprintjs/core';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
// actions
import { fetchUserProfile } from 'context/actions/auth/authThunks';
import { fetchProjectById } from 'context/actions/project/projectThunks';
import { fetchTasks, postTask, updateTask } from 'context/actions/task/taskThunks';
// components
import { ProjectDetailColumn } from 'components/ProjectDetail/Column';
import { ButtonWithDialogForm } from 'components/shared/ButtonWithDialogForm';
// constants
import type { ITask, ITaskStatus } from 'constants/types';
// config
import { COLUMNS, TASK_FIELDS, TASK_VALIDATION_SCHEMA } from 'components/ProjectDetail/config';
// store
import type { AppDispatch, RootState } from 'context/store';
// hooks
import { useToasterContext } from 'hooks/ToasterProvider/useToasterProvider';

import { format } from 'date-fns';

export const ProjectDetail: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toaster } = useToasterContext();
  const { projectId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { currentProject, loading, error } = useSelector((state: RootState) => state.projects);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    if (!user) {
      dispatch(fetchUserProfile());
    }

    dispatch(fetchProjectById(projectId));
    dispatch(fetchTasks(projectId));
  }, [
    dispatch,
    projectId,
    user,
  ]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = String(active.id);
    const newStatus = over.id as ITaskStatus;

    dispatch(updateTask(taskId, { status: newStatus }));
  };

  const handleTaskSubmit = async (values: Record<string, string>) => {
    try {
      const formattedDate = format(new Date(values.deadline), 'yyyy-MM-dd');

      const newTask: Omit<ITask, 'id'> = {
        projectId: Number(projectId),
        assigneeId: user.id,
        executorId: user.id,
        title: values.title,
        deadline: formattedDate,
        status: 'TODO',
        description: values.description,
        comments: [],
        files: [],
      };

      await dispatch(postTask(newTask));
    } catch (err) {
      toaster?.show({ message: `Ошибка при добавлении новой задачи: ${err}`, intent: 'danger' });
    }
  };

  const handleBack = () => {
    if (location.key === 'default') {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  if (loading || !user) {
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
        {`Ошибка загрузки проекта с сервера: ${error}`}
      </div>
    );
  }

  return (
    <div className="project-container">
      <div className="project-header">
        <Button icon="arrow-left" minimal onClick={handleBack} text="Назад" />

        <h1>{currentProject?.name}</h1>

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
              />
            ))
          }
        </DndContext>
      </div>
    </div>
  );
};
