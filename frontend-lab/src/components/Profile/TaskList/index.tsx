// libraries
import { type FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Intent, Spinner } from '@blueprintjs/core';
// actions
import { fetchUserTasks } from 'context/actions/task/taskThunks';
// store
import type { AppDispatch, RootState } from 'context/store';

interface TaskListProps {
  userId: number;
}

export const TaskList: FC<TaskListProps> = ({ userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userTasks, loading, error } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserTasks(userId));
    }
  }, [dispatch, userId]);

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
        Ошибка загрузки проектов с сервера:
        {error}
      </div>
    );
  }

  return (
    <Card className="tasks-list-container">
      <h2>📌 Мои задачи:</h2>
      {
          userTasks && userTasks?.length > 0 ? (
            <ul className="task-list">
              {
                  userTasks.map((task) => (
                    <li key={task.title} className="task-item">
                      <a href={`project/${task.projectId}/task/${task.id}`}>
                        {` ${task.status === 'DONE' ? '✅' : '🔄'} ${task.title}`}
                      </a>
                    </li>
                  ))
              }
            </ul>
          ) : (
            <p>Нет назначенных задач</p>
          )
      }
    </Card>
  );
};
