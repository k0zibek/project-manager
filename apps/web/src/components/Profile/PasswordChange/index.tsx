// libraries
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Button, Card, Intent } from '@blueprintjs/core';
import { yupResolver } from '@hookform/resolvers/yup';
// actions
import { changeUserPassword } from 'context/actions/auth/authThunks';
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

import { getErrorMessage } from 'shared/errors/getErrorMessage';

export const PasswordChange: FC = () => {
  const { toaster } = useToasterContext();
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control, handleSubmit, formState: { errors }, reset,
  } = useForm<ProfilePasswordForm>({
    defaultValues: PROFILE_PASSWORD_INITIAL_VALUES,
    resolver: yupResolver(PROFILE_PASSWORD_VALIDATION_SCHEMA),
    shouldFocusError: false,
  });

  const handleSubmitPassword = async (data: ProfilePasswordForm) => {
    setIsSubmitting(true);

    try {
      await dispatch(changeUserPassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }));

      reset(PROFILE_PASSWORD_INITIAL_VALUES);

      toaster?.show({ message: 'Пароль успешно изменен', intent: 'success' });
    } catch (err) {
      toaster?.show({
        message: `Ошибка при изменении пароля: ${getErrorMessage(err)}`,
        intent: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="password-change">
      <h3>🔑 Смена пароля</h3>
      <form className="form-password-change" onSubmit={handleSubmit(handleSubmitPassword)}>
        <FormInputField
          control={control}
          error={errors.currentPassword?.message}
          name="currentPassword"
          placeholder="Текущий пароль"
          type="password"
        />

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

        <Button intent={Intent.PRIMARY} loading={isSubmitting} text="Сохранить" type="submit" />
      </form>
    </Card>
  );
};
