// libraries
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Intent, Spinner } from '@blueprintjs/core';
// hooks
import { useMe } from 'features/auth/hooks/useAuth';

/** Guards routes that require authentication */
export const ProtectedRoutes = () => {
  const { data: user, isLoading } = useMe();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="loader-container">
        <Spinner aria-label="Loading..." intent={Intent.NONE} size={35} />
      </div>
    );
  }

  if (user) {
    return <Outlet />;
  }

  return <Navigate replace state={{ from: location }} to="/login" />;
};
