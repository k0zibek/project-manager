// libraries
import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Button, Card, Intent } from '@blueprintjs/core';
import { yupResolver } from '@hookform/resolvers/yup';
// actions
import { updateUserData } from 'context/actions/auth/authThunks';
// components
import { FormInputField } from 'components/shared/FormInputField';
// constants
import {
  PROFILE_PASSWORD_INITIAL_VALUES,
  PROFILE_PASSWORD_VALIDATION_SCHEMA,
  type ProfilePasswordForm,
} from 'components/Profile/PasswordChange/config';
// store
import type { AppDispatch } from 'context/store';
// hooks
import { useToasterContext } from 'hooks/ToasterProvider/useToasterProvider';

export const PasswordChange: FC = () => {
  const { toaster } = useToasterContext();
  const dispatch = useDispatch<AppDispatch>();

  const { control, handleSubmit, formState: { errors } } = useForm<ProfilePasswordForm>({
    defaultValues: PROFILE_PASSWORD_INITIAL_VALUES,
    resolver: yupResolver(PROFILE_PASSWORD_VALIDATION_SCHEMA),
    shouldFocusError: false,
  });

  const handleSubmitPassword = async (data: ProfilePasswordForm) => {
    try {
      dispatch(updateUserData({ password: data.newPassword }));

      toaster?.show({ message: 'Пароль успешно изменен', intent: 'success' });
    } catch (err) {
      toaster?.show({ message: `Ошибка при изменении пароля: ${err}`, intent: 'danger' });
    }
  };

  return (
    <Card className="password-change">
      <h3>🔑 Смена пароля</h3>
      <form className="form-password-change" onSubmit={handleSubmit(handleSubmitPassword)}>
        <FormInputField
          control={control}
          error={errors.newPassword?.message}
          name="newPassword"
          placeholder="Новый пароль"
          type="password"
        />

        <FormInputField
          control={control}
          error={errors.confirmPassword?.message}
          name="confirmPassword"
          placeholder="Подтвердите пароль"
          type="password"
        />

        <Button intent={Intent.PRIMARY} text="Сохранить" type="submit" />
      </form>
    </Card>
  );
};
