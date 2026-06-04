import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Intent } from '@blueprintjs/core';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

/** Catches render errors and shows a fallback UI */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console -- surface unexpected UI crashes during development
    console.error('UI error:', error, info.componentStack);
  }

  render(): ReactNode {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="error-container" style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Что-то пошло не так</h1>
          <p>Попробуйте обновить страницу.</p>
          <Button intent={Intent.PRIMARY} onClick={() => window.location.reload()} text="Обновить" />
        </div>
      );
    }

    return children;
  }
}
