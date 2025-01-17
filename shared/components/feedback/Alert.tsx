'use client';

import { cn } from '@/lib/utils/styles';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const variants = {
  info: 'bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  success: 'bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  warning: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  error: 'bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export function Alert({
  type = 'info',
  title,
  message,
  onClose,
  className,
}: AlertProps) {
  return (
    <div
      className={cn(
        'rounded-lg p-4',
        variants[type],
        className
      )}
      role="alert"
    >
      <div className="flex">
        <div className="flex-1">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          <div className={cn('text-sm', title && 'mt-2')}>
            {message}
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 focus:outline-none focus:ring-2 focus:ring-offset-2"
            onClick={onClose}
          >
            <span className="sr-only">Dismiss</span>
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
