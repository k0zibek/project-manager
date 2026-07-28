// libraries
import { type FC } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Intent } from '@blueprintjs/core';
import { yupResolver } from '@hookform/resolvers/yup';
// components
import { FormInputField } from 'components/shared/FormInputField';
// types
import type { LoginFormInputs } from 'constants/types';
// config
import { LOGIN_INITIAL_VALUES, LOGIN_VALIDATION_SCHEMA } from 'components/Login/config';
import { useToasterContext } from 'hooks/ToasterProvider/useToasterProvider';
// hooks
import { useLogin } from 'features/auth/hooks/useAuth';

import { getErrorMessage } from 'shared/errors/getErrorMessage';

type LoginLocationState = {
  from?: { pathname?: string };
};

export const Login: FC = () => {
  const { toaster } = useToasterContext();
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    defaultValues: LOGIN_INITIAL_VALUES,
    resolver: yupResolver(LOGIN_VALIDATION_SCHEMA),
    shouldFocusError: false,
  });

  const from = (location.state as LoginLocationState | null)?.from?.pathname ?? '/';

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data: LoginFormInputs) => {
    try {
      await login.mutateAsync({ email: data.email, password: data.password });

      navigate(from, { replace: true });

      toaster?.show({ message: 'Успех', intent: 'success' });
    } catch (err) {
      toaster?.show({ message: `Ошибка при входе: ${getErrorMessage(err)}`, intent: 'danger' });
    }
  };

  return (
    <div className="login-form-conatiner">
      <div className="form-container">
        <h1>Вход</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInputField
            control={control}
            error={errors.email?.message}
            label="Email"
            name="email"
            placeholder="Введите email"
            type="email"
          />

          <FormInputField
            control={control}
            error={errors.password?.message}
            label="Пароль"
            name="password"
            placeholder="Введите пароль"
            type="password"
          />

          {
            login.isError && (
            <div className="form-error-container" style={{ color: 'red', marginBottom: '1rem' }}>
              {getErrorMessage(login.error)}
            </div>
            )
          }

          <Button
            fill
            intent={Intent.PRIMARY}
            loading={login.isPending}
            text="Войти"
            type="submit"
          />
        </form>

        <p style={{ marginTop: '1rem' }}>
          Нет аккаунта?
          {' '}
          <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
};
