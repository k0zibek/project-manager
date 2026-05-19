import { type FC, type ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Intent, Spinner } from '@blueprintjs/core';
import { bootstrapAuth } from 'context/actions/auth/authThunks';
import type { AppDispatch, RootState } from 'context/store';

type AuthBootstrapProps = {
  children: ReactNode;
};

/** Loads session on app start via GET /auth/me */
export const AuthBootstrap: FC<AuthBootstrapProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.auth.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(bootstrapAuth());
    }
  }, [dispatch, status]);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="loader-container">
        <Spinner aria-label="Loading session..." intent={Intent.NONE} size={35} />
      </div>
    );
  }

  return children;
};
