import clsx from 'clsx';

import React from 'react';

export interface ErrorDisplayProps {
  /**
   * Error message or object to display
   */
  error: Error | string;

  /**
   * Optional retry callback
   */
  onRetry?: () => void;

  /**
   * Size variant of the error display
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Whether to show the stack trace (only in development)
   * @default false
   */
  showStack?: boolean;
}

/**
 * Component for displaying error messages with optional retry functionality
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  size = 'md',
  className,
  showStack = false,
}) => {
  const message = typeof error === 'string' ? error : error.message;
  const stack = error instanceof Error ? error.stack : undefined;

  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg',
  };

  return (
    <div
      role="alert"
      className={clsx(
        'rounded-lg bg-red-50 text-red-900 dark:bg-red-900/10 dark:text-red-200',
        sizeClasses[size],
        className
      )}
    >
      <div className="flex items-center gap-2">
        {/* Error Icon */}
        <svg
          className={clsx(
            'flex-shrink-0',
            size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6'
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>

        {/* Error Message */}
        <div className="flex-1">
          <p className="font-medium">{message}</p>

          {/* Stack Trace (Development Only) */}
          {process.env.NODE_ENV === 'development' && showStack && stack && (
            <pre className="mt-2 max-h-32 overflow-auto rounded bg-red-100 p-2 text-xs font-mono dark:bg-red-900/20">
              {stack}
            </pre>
          )}
        </div>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className={clsx(
              'rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-900',
              'hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2',
              'dark:bg-red-900/20 dark:text-red-200 dark:hover:bg-red-900/30',
              'transition-colors duration-200'
            )}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
