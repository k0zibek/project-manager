// libraries
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Intent } from '@blueprintjs/core';
// components
import { LinkButton } from 'components/shared/LinkButton';
// hooks
import { useLogout, useMe } from 'features/auth/hooks/useAuth';
// assets
import logoPng from 'assets/icons/logo.png';

export const Header: FC = () => {
  const { data: user } = useMe();
  const isAuthenticated = Boolean(user);
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate();
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
