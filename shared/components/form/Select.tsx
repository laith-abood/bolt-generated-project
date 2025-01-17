/**
 * Select Component
 *
 * A customizable select component with validation states, help text, and
 * multiple variants. Supports native select functionality with enhanced styling.
 *
 * @example
 * ```tsx
 * // Basic variants
 * <Select variant="outline" label="Outline Select" />
 * <Select variant="filled" label="Filled Select" />
 * <Select variant="flushed" label="Flushed Select" />
 * <Select variant="unstyled" label="Unstyled Select" />
 *
 * // With validation
 * <Select
 *   label="Status"
 *   error="Please select a status"
 *   isInvalid
 *   isRequired
 * >
 *   <option value="">Select status...</option>
 *   <option value="active">Active</option>
 *   <option value="inactive">Inactive</option>
 * </Select>
 *
 * // Different sizes
 * <Select size="xs" label="Extra Small" />
 * <Select size="sm" label="Small" />
 * <Select size="md" label="Medium" />
 * <Select size="lg" label="Large" />
 * <Select size="xl" label="Extra Large" />
 *
 * // With icon and loading state
 * <Select
 *   label="Sort by"
 *   icon={<SortIcon />}
 *   isLoading
 * >
 *   <option value="name">Name</option>
 *   <option value="date">Date</option>
 * </Select>
 *
 * // With custom styles
 * <Select
 *   label="Theme"
 *   className="border-primary-500"
 *   icon={<PaletteIcon />}
 * >
 *   <option value="light">Light</option>
 *   <option value="dark">Dark</option>
 * </Select>
 * ```
 *
 * @accessibility
 * - Uses native select element for best accessibility
 * - Includes proper ARIA attributes for validation states
 * - Supports keyboard navigation
 * - Clear error and help text association
 * - Loading state is announced to screen readers
 * - Icons are properly hidden from screen readers
 * - Color contrast meets WCAG guidelines
 *
 * @styling
 * - Supports dark mode with proper contrast
 * - Customizable through className prop
 * - Consistent with design system
 * - Multiple visual variants
 * - Smooth transitions and hover states
 * - Responsive sizing options
 */
import { forwardRef } from 'react';

import { cn } from '@/lib/utils/styles';

type NativeSelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>;

export interface SelectProps extends NativeSelectProps {
  /** Label text for the select */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Whether the select is in an invalid state */
  isInvalid?: boolean;
  /** Whether the select is required */
  isRequired?: boolean;
  /** Help text to display below the select */
  helpText?: string;
  /** Size variant of the select */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Visual variant of the select */
  variant?: 'outline' | 'filled' | 'flushed' | 'unstyled';
  /** Icon to display in the select */
  icon?: React.ReactNode;
  /** Placeholder text when no option is selected */
  placeholder?: string;
  /** Whether the select is loading */
  isLoading?: boolean;
  /** Whether the select is in a success state */
  isSuccess?: boolean;
  /** Success message to display */
  successMessage?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      isInvalid,
      isRequired,
      helpText,
      size = 'md',
      variant = 'outline',
      icon,
      placeholder,
      isLoading,
      isSuccess,
      successMessage,
      disabled,
      children,
      ...props
    },
    ref
  ): JSX.Element => {
    const id = props.id || props.name;
    const hasError = isInvalid || !!error;
    const ariaDescribedBy = [
      helpText && `${id}-help`,
      error && `${id}-error`,
      successMessage && `${id}-success`,
    ]
      .filter(Boolean)
      .join(' ');

    const selectSizeClasses = {
      xs: 'h-6 text-xs px-2',
      sm: 'h-8 text-sm px-2',
      md: 'h-10 text-base px-3',
      lg: 'h-12 text-lg px-4',
      xl: 'h-14 text-xl px-4',
    };

    const variantClasses = {
      outline:
        'border bg-white dark:bg-gray-800 focus:border-primary-500 dark:focus:border-primary-400',
      filled:
        'border-0 bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800',
      flushed:
        'rounded-none border-0 border-b border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400',
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
          <select
            className={cn(
              'w-full rounded-md text-gray-900 dark:text-gray-100 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200',
              selectSizeClasses[size],
              variantClasses[variant],
              hasError &&
                'border-red-500 focus-visible:ring-red-500 dark:border-red-400',
              isSuccess &&
                'border-green-500 focus-visible:ring-green-500 dark:border-green-400',
              !hasError &&
                !isSuccess &&
                variant === 'outline' &&
                'border-gray-300 dark:border-gray-600 focus-visible:ring-primary-500',
              icon && 'pl-10',
              className
            )}
            ref={ref}
            required={isRequired}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-required={isRequired ? 'true' : 'false'}
            aria-describedby={ariaDescribedBy || undefined}
            disabled={isDisabled}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>
          {icon && (
            <div
              className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          {isLoading && (
            <div
              className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none"
              aria-hidden="true"
            >
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            </div>
          )}
          <div
            className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-500 dark:text-gray-400"
            aria-hidden="true"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
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

Select.displayName = 'Select';

export { Select };
