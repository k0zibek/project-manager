// libraries
import { type FC } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Intent, Spinner } from '@blueprintjs/core';
// store
import type { RootState } from 'context/store';
// hooks
import { useMyTasks } from 'features/tasks/hooks/useTasks';

import { format } from 'date-fns';
import { getErrorMessage } from 'shared/errors/getErrorMessage';

/** Lists tasks assigned to the current user */
export const TaskList: FC = () => {
  const authStatus = useSelector((state: RootState) => state.auth.status);
  const isAuthenticated = authStatus === 'authenticated';

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useMyTasks(isAuthenticated);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="tasks-list-container">
        <Spinner intent={Intent.NONE} size={24} />
      </Card>
    );
  }

  if (isError) {
    const message = getErrorMessage(error, 'Не удалось загрузить задачи');

    return (
      <Card className="tasks-list-container">
        <p>{message}</p>
      </Card>
    );
  }

  return (
    <Card className="tasks-list-container">
      <h2>📌 Мои задачи</h2>

      {tasks.length === 0 ? (
        <p>Нет назначенных задач</p>
      ) : (
        <ul className="tasks-list">
          {tasks.map((task) => (
            <li key={task.id}>
              <Link to={`/project/${task.projectId}/task/${task.id}`}>
                {`${task.title} — до ${format(new Date(task.deadline), 'dd.MM.yyyy')}`}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
