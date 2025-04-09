import * as yup from 'yup';

export const BYTE = 1024;

export const FIXED_VALUE = 2;

export type UploadStatusType = 'idle' | 'uploading' | 'error' | 'success';

export const TASK_STATUS_FIELDS = [
  {
    name: 'status',
    label: 'Выберите статус задачи',
    placeholder: 'Статус задачи',
    type: 'select' as const,
    options: [
      { value: '', label: '-' },
      { value: 'TODO', label: 'To do' },
      { value: 'IN_PROGRESS', label: 'In progress' },
      { value: 'DONE', label: 'Done' },
    ],
  },
];

export const TASK_STATUS_VALIDATION_SCHEMA = yup.object().shape({
  status: yup.string().required('Выберите статус задачи'),
});
