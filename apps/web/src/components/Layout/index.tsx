// libraries
import type { FC, ReactNode } from 'react';
// components
import { Header } from 'components/Layout/Header';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => (
  <div className="wrapper">
    <Header />

    <main className="main-container">
      {children}
    </main>
  </div>
);
