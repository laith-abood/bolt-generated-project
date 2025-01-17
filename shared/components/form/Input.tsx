'use client';

import { forwardRef } from 'react';

import { cn } from '@/lib/utils/styles';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Label text for the input */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Whether the input is in an invalid state */
  isInvalid?: boolean;
  /** Whether the input is required */
  isRequired?: boolean;
  /** Help text to display below the input */
  helpText?: string;
  /** Icon to display on the left side of the input */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right side of the input */
  rightIcon?: React.ReactNode;
  /** Whether the input is in a success state */
  isSuccess?: boolean;
  /** Success message to display */
  successMessage?: string;
  /** Size variant of the input */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Visual variant of the input */
  variant?: 'outline' | 'filled' | 'flushed' | 'unstyled';
  /** Text or element to display before the input */
  prefix?: React.ReactNode;
  /** Text or element to display after the input */
  suffix?: React.ReactNode;
  /** Whether the input is loading */
  isLoading?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      isInvalid,
      isRequired,
      helpText,
      type = 'text',
      leftIcon,
      rightIcon,
      isSuccess,
      successMessage,
      size = 'md',
      variant = 'outline',
      prefix,
      suffix,
      isLoading,
      disabled,
      ...props
    },
    ref
  ) => {
    const id = props.id || props.name;
    const hasError = isInvalid || !!error;
    const ariaDescribedBy = [
      helpText && `${id}-help`,
      error && `${id}-error`,
      successMessage && `${id}-success`,
    ]
      .filter(Boolean)
      .join(' ');

    const inputSizeClasses = {
      xs: 'h-6 text-xs px-2',
      sm: 'h-8 text-sm px-2',
      md: 'h-10 text-base px-3',
      lg: 'h-12 text-lg px-4',
      xl: 'h-14 text-xl px-4',
    };

    const variantClasses = {
      outline: 'border bg-white dark:bg-gray-800',
      filled:
        'border-0 bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800',
      flushed: 'rounded-none border-0 border-b',
      unstyled: 'border-0 bg-transparent p-0 focus:ring-0',
    };

    const isDisabled = isLoading || disabled;

    return (
      <div className="w-full">
        {label && (
          <label
            className={cn(
              'block font-medium mb-1 text-gray-700 dark:text-gray-200',
              size === 'xs' && 'text-xs',
              size === 'sm' && 'text-sm',
              size === 'md' && 'text-base',
              size === 'lg' && 'text-lg',
              size === 'xl' && 'text-xl'
            )}
            htmlFor={id}
          >
            {label}
            {isRequired && (
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          {prefix && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
              {prefix}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'w-full rounded-md text-gray-900 dark:text-gray-100 ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              inputSizeClasses[size],
              variantClasses[variant],
              hasError &&
                'border-red-500 focus-visible:ring-red-500 dark:border-red-400',
              isSuccess &&
                'border-green-500 focus-visible:ring-green-500 dark:border-green-400',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              prefix && 'pl-8',
              suffix && 'pr-8',
              !hasError &&
                !isSuccess &&
                variant === 'outline' &&
                'border-gray-300 dark:border-gray-600 focus-visible:ring-primary-500',
              className
            )}
            ref={ref}
            required={isRequired}
            {...(hasError ? { 'aria-invalid': 'true' } : {})}
            {...(isRequired ? { 'aria-required': 'true' } : {})}
            {...(ariaDescribedBy
              ? { 'aria-describedby': ariaDescribedBy }
              : {})}
            disabled={isDisabled}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
          {suffix && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
              {suffix}
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            </div>
          )}
        </div>
        {helpText && (
          <p
            id={`${id}-help`}
            className={cn(
              'mt-1 text-gray-500 dark:text-gray-400',
              size === 'xs' && 'text-xs',
              size === 'sm' && 'text-xs',
              size === 'md' && 'text-sm',
              size === 'lg' && 'text-base',
              size === 'xl' && 'text-lg'
            )}
          >
            {helpText}
          </p>
        )}
        {error && (
          <p
            id={`${id}-error`}
            className={cn(
              'mt-1 text-red-500 dark:text-red-400',
              size === 'xs' && 'text-xs',
              size === 'sm' && 'text-xs',
              size === 'md' && 'text-sm',
              size === 'lg' && 'text-base',
              size === 'xl' && 'text-lg'
            )}
            role="alert"
          >
            {error}
          </p>
        )}
        {isSuccess && successMessage && (
          <p
            id={`${id}-success`}
            className={cn(
              'mt-1 text-green-500 dark:text-green-400',
              size === 'xs' && 'text-xs',
              size === 'sm' && 'text-xs',
              size === 'md' && 'text-sm',
              size === 'lg' && 'text-base',
              size === 'xl' && 'text-lg'
            )}
            role="status"
          >
            {successMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
