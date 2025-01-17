/**
 * Link Component
 *
 * An enhanced link component that extends Next.js Link with proper accessibility
 * and styling support.
 *
 * @example
 * ```tsx
 * // Basic link
 * <Link href="/about">About</Link>
 *
 * // External link
 * <Link href="https://example.com" external>
 *   External Link
 * </Link>
 * ```
 */
import NextLink from 'next/link';

import { cn } from '@/lib/utils/styles';

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The URL to link to */
  href: string;
  /** Whether the link points to an external resource */
  external?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function Link({
  href,
  external,
  className,
  children,
  ...props
}: LinkProps): JSX.Element {
  const isExternal = external || href.startsWith('http');
  const classes = cn(
    'text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300',
    'underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
    className
  );

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={classes} {...props}>
      {children}
    </NextLink>
  );
}
