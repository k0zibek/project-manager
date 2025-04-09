import * as yup from 'yup';
import type { FieldDefinition } from 'constants/types';

const minLength = 2;

export const PROJECT_FIELDS: FieldDefinition[] = [
  {
    name: 'name', label: 'Название проекта', placeholder: 'Введите название проекта',
  },
  {
    name: 'description', label: 'Описание', placeholder: 'Опишите проект',
  },
];

export const PAGE_SIZE_CONFIG = [
  { size: 6 },
  { size: 12 },
  { size: 18 },
];

export const PROJECT_VALIDATION_SCHEMA = yup.object().shape({
  name: yup.string().required('Назови свой проект').min(minLength, 'Минимум 2 символа'),
  description: yup.string().required('Обязательное поле'),
});
