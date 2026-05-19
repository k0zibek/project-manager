// libraries
import { type FC } from 'react';
import { Card } from '@blueprintjs/core';

/** Legacy task list — enabled after PR 3 API migration */
export const TaskList: FC = () => (
  <Card className="tasks-list-container">
    <h2>📌 Мои задачи</h2>
    <p>Будут доступны после миграции задач на новый API (PR 3).</p>
  </Card>
);
