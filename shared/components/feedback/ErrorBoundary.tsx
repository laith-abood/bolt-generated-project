import React from 'react';

import { getConfig } from '@/lib/config';
import { ErrorHandler } from '@/lib/errors/ErrorHandler';

import { Button } from '../form/Button';
import { Alert } from './Alert';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: Array<unknown>;
}

interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const { onError } = this.props;

    // Update state with error details
    this.setState({ error, errorInfo });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Report error to error handling service
    void ErrorHandler.handleError(error, {
      action: 'render_error',
      metadata: {
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
      },
    });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetKeys } = this.props;

    if (resetKeys) {
      // Check if any reset keys have changed
      const hasKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      );

      if (hasKeyChanged) {
        this.reset();
      }
    }
  }

  private reset = (): void => {
    const { onReset } = this.props;
    const { retryCount } = this.state;

    if (retryCount < MAX_RETRIES) {
      // Increment retry count and clear error state
      this.setState((prevState) => ({
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));

      // Call custom reset handler if provided
      if (onReset) {
        onReset();
      }
    }
  };

  private handleRetry = (): void => {
    const { retryCount } = this.state;

    if (retryCount < MAX_RETRIES) {
      // Add delay before retry to prevent rapid retries
      setTimeout(this.reset, RETRY_DELAY);
    }
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): React.ReactNode {
    const { error, retryCount } = this.state;
    const { children, fallback } = this.props;
    const isDevelopment = getConfig('env').NODE_ENV === 'development';

    if (error) {
      if (fallback) {
        return fallback;
      }

      const canRetry = retryCount < MAX_RETRIES;
      const errorMessage = isDevelopment
        ? `${error.name}: ${error.message}`
        : 'An unexpected error occurred. Please try again later.';

      return (
        <div className="p-4 space-y-4">
          <Alert
            type="error"
            title={error.name || 'Error'}
            message={errorMessage}
          />
          {isDevelopment && error.stack && (
            <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto text-sm">
              {error.stack}
            </pre>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="primary" onClick={this.handleReload}>
              Reload Page
            </Button>
            {canRetry && (
              <Button variant="outline" onClick={this.handleRetry}>
                Try Again ({MAX_RETRIES - retryCount} attempts left)
              </Button>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}
