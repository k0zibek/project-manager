// libraries
import { type FC } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  H4,
  Intent,
  Spinner,
} from '@blueprintjs/core';
import { useDroppable } from '@dnd-kit/core';
// components
import { TaskCard } from 'components/ProjectDetail/Column/TaskCard';
// constants
import type { IColumn, ITask } from 'constants/types';
// store
import type { RootState } from 'context/store';

interface ColumnProps {
  column: IColumn;
}

export const ProjectDetailColumn: FC<ColumnProps> = ({ column }) => {
  const { setNodeRef } = useDroppable({ id: column.id });
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);

  const filteredTasks: ITask[] = tasks?.filter((task) => task.status === column.id);

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
        {`Ошибка загрузки задач с сервера: ${error}`}
      </div>
    );
  }

  return (
    <div ref={setNodeRef} className="task-column">
      <Card className="task-state-title-container">
        <H4 className="task-state-title">{column.title}</H4>
      </Card>

      {filteredTasks?.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};
