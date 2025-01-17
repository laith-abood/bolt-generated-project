import clsx from 'clsx';

import React from 'react';

export interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Color variant of the spinner
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'white';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Accessibility label
   * @default "Loading"
   */
  label?: string;
}

/**
 * Loading spinner component for indicating loading states
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className,
  label = 'Loading',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const variantClasses = {
    primary: 'border-primary-200 border-t-primary-600',
    secondary: 'border-gray-200 border-t-gray-600',
    white: 'border-white/30 border-t-white',
  };

  return (
    <div
      role="status"
      aria-label={label}
      className={clsx(
        'inline-block animate-spin rounded-full',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
