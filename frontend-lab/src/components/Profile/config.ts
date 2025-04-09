import * as yup from 'yup';
import type { FieldDefinition } from 'constants/types';

const minNameLength = 2;

export const PROFILE_NAME_VALIDATION_SCHEMA = yup.object().shape({
  name: yup.string().min(minNameLength, 'Минимум 2 буквы'),
});

export const PROFILE_FIELDS: FieldDefinition[] = [
  {
    name: 'name', label: 'Новое имя', placeholder: 'Введите ваше имя',
  },
];
