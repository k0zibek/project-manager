// libraries
import { type FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Intent } from '@blueprintjs/core';
import { useDraggable } from '@dnd-kit/core';
// components
import { LinkButton } from 'components/shared/LinkButton';
// constants
import type { ITask } from 'constants/types';

interface TaskCardProps {
  task: ITask;
}

export const TaskCard: FC<TaskCardProps> = ({ task }) => {
  const { pathname } = useLocation();
  const {
    attributes, listeners, setNodeRef, transform,
  } = useDraggable({
    id: task.id.toString(),
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    willChange: 'transform',
  } : {};

  return (
    <div ref={setNodeRef} className="task-card-container" style={style}>
      <Card {...attributes} {...listeners} className="task-card-content">
        <div>{task.title}</div>
      </Card>
      <LinkButton
        className="task-card-btn"
        intent={Intent.WARNING}
        link={`${pathname}/task/${task.id}`}
        text="Edit"
      />
    </div>
  );
};
