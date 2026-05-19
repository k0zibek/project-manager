import * as yup from 'yup';
import type { LoginFormInputs } from 'constants/types';

export const LOGIN_INITIAL_VALUES: LoginFormInputs = {
  email: '',
  password: '',
};

export const LOGIN_VALIDATION_SCHEMA = yup.object().shape({
  email: yup.string().email('Неверный формат Email').required('Обязтельное поле'),
  password: yup.string().required('Обязтельное поле'),
});
