import * as yup from 'yup';

const minPasswordLength = 6;

export const PROFILE_PASSWORD_INITIAL_VALUES = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export const PROFILE_PASSWORD_VALIDATION_SCHEMA = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Введите текущий пароль')
    .min(minPasswordLength, 'Минимум 6 символов'),
  newPassword: yup
    .string()
    .required('Введите новый пароль')
    .min(minPasswordLength, 'Минимум 6 символов'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Пароли должны совпадать')
    .required('Подтвердите пароль'),
});

export interface ProfilePasswordForm {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
