// libraries
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
// store
import type { RootState } from 'context/store';

export const ProtectedRoutes = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const location = useLocation();

  return isAuthenticated ? (<Outlet />) : (<Navigate replace state={{ from: location }} to="/login" />);
};
