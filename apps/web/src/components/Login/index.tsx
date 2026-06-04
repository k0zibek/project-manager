// libraries
import { type FC } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Intent } from '@blueprintjs/core';
import { yupResolver } from '@hookform/resolvers/yup';
// actions
import { loginUser } from 'context/actions/auth/authThunks';
// components
import { FormInputField } from 'components/shared/FormInputField';
// types
import type { LoginFormInputs } from 'constants/types';
// config
import { LOGIN_INITIAL_VALUES, LOGIN_VALIDATION_SCHEMA } from 'components/Login/config';
// store
import type { AppDispatch, RootState } from 'context/store';
// hooks
import { useToasterContext } from 'hooks/ToasterProvider/useToasterProvider';

import { getErrorMessage } from 'shared/errors/getErrorMessage';

type LoginLocationState = {
  from?: { pathname?: string };
};

export const Login: FC = () => {
  const { toaster } = useToasterContext();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const isLoading = status === 'loading';
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    defaultValues: LOGIN_INITIAL_VALUES,
    resolver: yupResolver(LOGIN_VALIDATION_SCHEMA),
    shouldFocusError: false,
  });

  const from = (location.state as LoginLocationState | null)?.from?.pathname ?? '/';

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data: LoginFormInputs) => {
    try {
      await dispatch(loginUser({ email: data.email, password: data.password }));

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
            error && (
            <div className="form-error-container" style={{ color: 'red', marginBottom: '1rem' }}>
              {error}
            </div>
            )
          }

          <Button
            fill
            intent={Intent.PRIMARY}
            loading={isLoading}
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
