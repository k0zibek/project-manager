// libraries
import { type FC } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
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

export const Login: FC = () => {
  const { toaster } = useToasterContext();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    defaultValues: LOGIN_INITIAL_VALUES,
    resolver: yupResolver(LOGIN_VALIDATION_SCHEMA),
    shouldFocusError: false,
  });

  const from = (location.state)?.from?.pathname || '/';

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data: LoginFormInputs) => {
    try {
      await dispatch(loginUser({ email: data.email, password: data.password }));

      navigate(from, { replace: true });

      toaster?.show({ message: 'Успех', intent: 'success' });
    } catch (err) {
      toaster?.show({ message: `Ошибка при входе: ${err}`, intent: 'danger' });
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
            authState.error && (
            <div className="form-error-container" style={{ color: 'red', marginBottom: '1rem' }}>
              {authState.error}
            </div>
            )
          }

          <Button
            fill
            intent={Intent.PRIMARY}
            loading={authState.loading}
            text="Войти"
            type="submit"
          />
        </form>
      </div>
    </div>
  );
};
