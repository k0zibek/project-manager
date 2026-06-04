// libraries
import { type FC } from 'react';
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

interface ColumnProps {
  column: IColumn;
  tasks: ITask[];
  isUpdating?: boolean;
}

/** Kanban column with tasks filtered by status */
export const ProjectDetailColumn: FC<ColumnProps> = ({ column, tasks, isUpdating }) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const filteredTasks = tasks.filter((task) => task.status === column.id);

  return (
    <div ref={setNodeRef} className={`task-column${isOver ? ' task-column--over' : ''}`}>
      <Card className="task-state-title-container">
        <H4 className="task-state-title">
          {column.title}
          {isUpdating && <Spinner intent={Intent.NONE} size={16} />}
        </H4>
      </Card>

      {filteredTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};
