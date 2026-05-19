// libraries
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Intent, Spinner } from '@blueprintjs/core';
// store
import type { RootState } from 'context/store';

/** Guards routes that require authentication */
export const ProtectedRoutes = () => {
  const { status } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="loader-container">
        <Spinner aria-label="Loading..." intent={Intent.NONE} size={35} />
      </div>
    );
  }

  if (status === 'authenticated') {
    return <Outlet />;
  }

  return <Navigate replace state={{ from: location }} to="/login" />;
};
