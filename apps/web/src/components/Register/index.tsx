// libraries
import { type FC } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Intent } from '@blueprintjs/core';
import { yupResolver } from '@hookform/resolvers/yup';
// actions
import { registerUser } from 'context/actions/auth/authThunks';
// components
import { FormInputField } from 'components/shared/FormInputField';
// config
import {
  REGISTER_INITIAL_VALUES,
  REGISTER_VALIDATION_SCHEMA,
  type RegisterFormInputs,
} from 'components/Register/config';
// store
import type { AppDispatch, RootState } from 'context/store';
// hooks
import { useToasterContext } from 'hooks/ToasterProvider/useToasterProvider';

export const Register: FC = () => {
  const { toaster } = useToasterContext();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const isLoading = status === 'loading';

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({
    defaultValues: REGISTER_INITIAL_VALUES,
    resolver: yupResolver(REGISTER_VALIDATION_SCHEMA),
    shouldFocusError: false,
  });

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      await dispatch(registerUser({
        name: data.name!,
        email: data.email!,
        password: data.password!,
      }));

      navigate('/', { replace: true });

      toaster?.show({ message: 'Регистрация успешна', intent: 'success' });
    } catch (err) {
      toaster?.show({ message: `Ошибка регистрации: ${err}`, intent: 'danger' });
    }
  };

  return (
    <div className="login-form-conatiner">
      <div className="form-container">
        <h1>Регистрация</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInputField
            control={control}
            error={errors.name?.message}
            label="Имя"
            name="name"
            placeholder="Ваше имя"
          />

          <FormInputField
            control={control}
            error={errors.email?.message}
            label="Email"
            name="email"
            placeholder="Email"
            type="email"
          />

          <FormInputField
            control={control}
            error={errors.password?.message}
            label="Пароль"
            name="password"
            placeholder="Пароль"
            type="password"
          />

          {error && (
            <div className="form-error-container" style={{ color: 'red', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <Button
            fill
            intent={Intent.PRIMARY}
            loading={isLoading}
            text="Зарегистрироваться"
            type="submit"
          />
        </form>

        <p style={{ marginTop: '1rem' }}>
          Уже есть аккаунт?
          {' '}
          <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
};
