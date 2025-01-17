'use client';

import { useEffect, useState } from 'react';

// Predefined breakpoints matching Tailwind's default breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Creates a media query string from a breakpoint or custom query
 */
function createMediaQuery(query: string | number): string {
  // If it's a number, assume it's a pixel value
  if (typeof query === 'number') {
    return `(min-width: ${query}px)`;
  }

  // If it's a predefined breakpoint, use that value
  if (query in breakpoints) {
    return `(min-width: ${breakpoints[query as Breakpoint]})`;
  }

  // Otherwise, use the query as is
  return query;
}

/**
 * Hook to check if a media query matches
 * @param query - Media query string, breakpoint key, or pixel value
 * @returns boolean indicating if the media query matches
 *
 * @example
 * // Using predefined breakpoint
 * const isDesktop = useMediaQuery('lg');
 *
 * // Using custom pixel value
 * const isWide = useMediaQuery(1400);
 *
 * // Using custom media query
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string | number | Breakpoint): boolean {
  // Initialize with null to avoid hydration mismatch
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    // Create the media query
    const mediaQuery = window.matchMedia(createMediaQuery(query));

    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const listener = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', listener);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, [query]);

  // Return false during SSR to avoid hydration mismatch
  return matches ?? false;
}

/**
 * Hook to get responsive values based on breakpoints
 * @param values - Object with breakpoint values
 * @returns The value for the current breakpoint
 *
 * @example
 * const columns = useResponsive({ base: 1, md: 2, lg: 3 });
 */
export function useResponsive<T>(
  values: Partial<Record<Breakpoint | 'base', T>>
): T {
  const isSm = useMediaQuery('sm');
  const isMd = useMediaQuery('md');
  const isLg = useMediaQuery('lg');
  const isXl = useMediaQuery('xl');
  const is2Xl = useMediaQuery('2xl');

  if (is2Xl && values['2xl'] !== undefined) return values['2xl'];
  if (isXl && values.xl !== undefined) return values.xl;
  if (isLg && values.lg !== undefined) return values.lg;
  if (isMd && values.md !== undefined) return values.md;
  if (isSm && values.sm !== undefined) return values.sm;
  if (values.base !== undefined) return values.base;

  throw new Error('No base value provided for useResponsive');
}
