import * as yup from 'yup';

const minPasswordLength = 6;

export const REGISTER_INITIAL_VALUES = {
  name: '',
  email: '',
  password: '',
};

export const REGISTER_VALIDATION_SCHEMA = yup.object().shape({
  name: yup.string().required('Введите имя').min(1, 'Минимум 1 символ'),
  email: yup.string().required('Введите email').email('Некорректный email'),
  password: yup.string().required('Введите пароль').min(minPasswordLength, 'Минимум 6 символов'),
});

export interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
}
