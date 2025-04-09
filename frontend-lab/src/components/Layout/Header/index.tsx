// libraries
import type { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Intent } from '@blueprintjs/core';
// actions
import { authActions } from 'context/actions/auth/authSlice';
// components
import { LinkButton } from 'components/shared/LinkButton';
// store
import type { AppDispatch, RootState } from 'context/store';
// assets
import logoPng from 'assets/icons/logo.png';

export const Header: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  return (
    <header className="header-container">
      <div className="header-nav">
        <div className="header-logo">
          <Link className="logo-link" to="/">
            <img alt="logo" className="logo" src={logoPng} />
            <span>PROJECT MANAGER</span>
          </Link>
        </div>
      </div>

      <div className="header-nav">
        {
          isAuthenticated ? (
            <>
              <LinkButton
                icon="user"
                intent={Intent.SUCCESS}
                link="/profile"
                text="Профиль"
              />

              <LinkButton
                handleClick={handleLogout}
                icon="log-out"
                intent={Intent.WARNING}
                link="/"
                text="Выйти"
              />
            </>
          ) : (
            <LinkButton
              icon="log-in"
              intent={Intent.PRIMARY}
              link="/login"
              text="Войти"
            />
          )
        }
      </div>
    </header>
  );
};
