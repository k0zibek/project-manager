import * as yup from 'yup';
import type { FieldDefinition, IColumn } from 'constants/types';

export const COLUMNS: IColumn[] = [
  { id: 'TODO', title: '📌 To Do' },
  { id: 'IN_PROGRESS', title: '🔄 In Progress' },
  { id: 'DONE', title: '✅ Done' },
];

export const TASK_FIELDS: FieldDefinition[] = [
  {
    name: 'title', label: 'Название задачи', placeholder: 'Введите название задачи',
  },
  {
    name: 'description', label: 'Описание задачи', placeholder: 'Введите описание',
  },
  {
    name: 'deadline', label: 'Дедлайн', placeholder: 'Выберите дату', type: 'date',
  },
];

export const TASK_VALIDATION_SCHEMA = yup.object().shape({
  title: yup.string().required('Напишите название задачи'),
  description: yup.string().required('Опишите задачу'),
  deadline: yup.date()
    .min(new Date().toISOString().split('T')[0], 'Дедлай не может быть раньше сегодняшнего дня')
    .required('Выберите дату выполнения'),
});
