// libraries
import { type FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, Intent, Spinner,
} from '@blueprintjs/core';
// actions
import { fetchUserProfile, updateUserData } from 'context/actions/auth/authThunks';
// components
import { PasswordChange } from 'components/Profile/PasswordChange';
import { TaskList } from 'components/Profile/TaskList';
import { ButtonWithDialogForm } from 'components/shared/ButtonWithDialogForm';
// config
import { PROFILE_FIELDS, PROFILE_NAME_VALIDATION_SCHEMA } from 'components/Profile/config';
// store
import type { AppDispatch, RootState } from 'context/store';
// hooks
import { useToasterContext } from 'hooks/ToasterProvider/useToasterProvider';

export const Profile: FC = () => {
  const { toaster } = useToasterContext();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  const handleSubmitName = async (values: Record<string, string>) => {
    try {
      await dispatch(updateUserData({ name: values.name }));

      toaster?.show({ message: 'Имя успешно изменено', intent: 'success' });
    } catch (err) {
      toaster?.show({ message: `Ошибка при изменении имени: ${err}`, intent: 'danger' });
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <Spinner
          aria-label="Loading..."
          intent={Intent.NONE}
          size={35}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        {`Ошибка загрузки пользователя: ${error}`}
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Card className="profile-header">
        <img
          alt="Avatar"
          className="user-avatar"
          src={user?.avatarUrl}
        />

        <div className="user-name-container">
          <h1 className="user-name">{user?.name}</h1>
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
          {` ${user?.email}`}
        </p>
      </Card>

      <PasswordChange />

      <TaskList userId={user?.id} />
    </div>
  );
};
