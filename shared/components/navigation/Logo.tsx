/**
 * Logo Component
 *
 * A component for displaying the application logo with proper accessibility
 * and responsive sizing.
 *
 * @example
 * ```tsx
 * // Default logo
 * <Logo />
 *
 * // Custom size
 * <Logo size="lg" />
 * ```
 */
import { getConfig } from '@/lib/config';
import { cn } from '@/lib/utils/styles';

export interface LogoProps {
  /** Size variant of the logo */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const logoSizes = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
};

export function Logo({ size = 'md', className }: LogoProps): JSX.Element {
  const appName = getConfig('app').name;

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <svg
        className={cn(
          'text-primary-600 dark:text-primary-400',
          logoSizes[size]
        )}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
      <span
        className={cn(
          'font-bold text-gray-900 dark:text-gray-100',
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-base',
          size === 'lg' && 'text-lg'
        )}
      >
        {appName}
      </span>
    </div>
  );
}
