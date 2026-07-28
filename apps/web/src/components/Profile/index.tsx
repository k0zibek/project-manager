// libraries
import { type FC } from 'react';
import {
  Card, Intent,
} from '@blueprintjs/core';
// components
import { PasswordChange } from 'components/Profile/PasswordChange';
import { TaskList } from 'components/Profile/TaskList';
import { ButtonWithDialogForm } from 'components/shared/ButtonWithDialogForm';
// config
import { PROFILE_FIELDS, PROFILE_NAME_VALIDATION_SCHEMA } from 'components/Profile/config';
import { useToasterContext } from 'hooks/ToasterProvider/useToasterProvider';
// hooks
import { useMe, useUpdateProfile } from 'features/auth/hooks/useAuth';

import { getErrorMessage } from 'shared/errors/getErrorMessage';

export const Profile: FC = () => {
  const { toaster } = useToasterContext();
  const { data: user, isError, error } = useMe();
  const updateProfile = useUpdateProfile();

  const handleSubmitName = async (values: Record<string, string>) => {
    try {
      await updateProfile.mutateAsync({ name: values.name });

      toaster?.show({ message: 'Имя успешно изменено', intent: 'success' });
    } catch (err) {
      toaster?.show({ message: `Ошибка при изменении имени: ${getErrorMessage(err)}`, intent: 'danger' });
    }
  };

  if (isError) {
    return (
      <div className="error-container">
        {`Ошибка загрузки пользователя: ${getErrorMessage(error)}`}
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="profile-container">
      <Card className="profile-header">
        {user.avatarUrl ? (
          <img
            alt="Avatar"
            className="user-avatar"
            src={user.avatarUrl}
          />
        ) : null}

        <div className="user-name-container">
          <h1 className="user-name">{user.name}</h1>
        </div>

        <ButtonWithDialogForm
          dialogTitle="Редактировать имя"
          fields={PROFILE_FIELDS}
          icon="edit"
          intent={Intent.NONE}
          isMinimal
          onSubmit={handleSubmitName}
          validationSchema={PROFILE_NAME_VALIDATION_SCHEMA}
        />
      </Card>

      <Card className="profile-info">
        <p className="user-email">
          <strong>📧 Email:</strong>
          {` ${user.email}`}
        </p>
      </Card>

      <PasswordChange />

      <TaskList />
    </div>
  );
};
