import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';

/**
 * Type definition for Hero Icons components
 * Used for both outline and solid variants
 */
export type HeroIcon = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, 'ref'> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & RefAttributes<SVGSVGElement>
>;
