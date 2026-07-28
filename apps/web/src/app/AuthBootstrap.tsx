import { type FC, type ReactNode, useEffect } from 'react';
import { Intent, Spinner } from '@blueprintjs/core';
import { useQueryClient } from '@tanstack/react-query';
import { useMe } from 'features/auth/hooks/useAuth';

import { authKeys } from 'features/auth/queryKeys';
import { setUnauthorizedHandler } from 'shared/api/authSession';

type AuthBootstrapProps = {
  children: ReactNode;
};

/** Loads session on app start via GET /auth/me */
export const AuthBootstrap: FC<AuthBootstrapProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const { isLoading } = useMe();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      queryClient.setQueryData(authKeys.me(), null);
    });

    return () => setUnauthorizedHandler(null);
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="loader-container">
        <Spinner aria-label="Loading session..." intent={Intent.NONE} size={35} />
      </div>
    );
  }

  return children;
};
