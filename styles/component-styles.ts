import {
  borderRadius,
  shadows,
  spacing,
  transitions,
  typography,
  zIndex,
} from './design-tokens';

export const baseInputStyles = {
  base: `
    block
    w-full
    rounded-${borderRadius.lg}
    border
    border-gray-300
    bg-white
    px-${spacing[4]}
    py-${spacing[2]}
    text-${typography.sizes.base}
    text-gray-900
    placeholder:text-gray-500
    focus:border-primary-500
    focus:outline-none
    focus:ring-2
    focus:ring-primary-500
    disabled:cursor-not-allowed
    disabled:bg-gray-50
    disabled:text-gray-500
    dark:border-gray-600
    dark:bg-gray-700
    dark:text-white
    dark:placeholder:text-gray-400
    dark:focus:border-primary-400
    dark:focus:ring-primary-400
  `,
  error: `
    border-error-light
    focus:border-error-light
    focus:ring-error-light
    dark:border-error-dark
    dark:focus:border-error-dark
    dark:focus:ring-error-dark
  `,
  success: `
    border-success-light
    focus:border-success-light
    focus:ring-success-light
    dark:border-success-dark
    dark:focus:border-success-dark
    dark:focus:ring-success-dark
  `,
};

export const baseButtonStyles = {
  base: `
    inline-flex
    items-center
    justify-center
    rounded-${borderRadius.lg}
    font-${typography.weights.medium}
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    disabled:cursor-not-allowed
    disabled:opacity-50
    transition-all
    duration-${transitions.DEFAULT}
  `,
  sizes: {
    sm: `px-${spacing[2]} py-${spacing[1]} text-${typography.sizes.sm}`,
    md: `px-${spacing[4]} py-${spacing[2]} text-${typography.sizes.base}`,
    lg: `px-${spacing[6]} py-${spacing[3]} text-${typography.sizes.lg}`,
  },
  variants: {
    primary: `
      bg-primary-600
      text-white
      hover:bg-primary-700
      focus:ring-primary-500
      dark:bg-primary-500
      dark:hover:bg-primary-600
    `,
    secondary: `
      bg-white
      text-gray-700
      border
      border-gray-300
      hover:bg-gray-50
      focus:ring-primary-500
      dark:bg-gray-800
      dark:text-gray-200
      dark:border-gray-600
      dark:hover:bg-gray-700
    `,
    danger: `
      bg-error-light
      text-white
      hover:bg-error-dark
      focus:ring-error-light
      dark:bg-error-dark
      dark:hover:bg-error-light
    `,
  },
};

export const baseCardStyles = `
  bg-white
  rounded-${borderRadius.xl}
  shadow-${shadows.DEFAULT}
  overflow-hidden
  dark:bg-gray-800
  dark:border
  dark:border-gray-700
`;

export const baseFormStyles = {
  group: `space-y-${spacing[4]}`,
  label: `
    block
    text-${typography.sizes.sm}
    font-${typography.weights.medium}
    text-gray-700
    dark:text-gray-200
    mb-${spacing[1]}
  `,
  error: `
    text-${typography.sizes.sm}
    text-error-light
    mt-${spacing[1]}
    dark:text-error-dark
  `,
  success: `
    text-${typography.sizes.sm}
    text-success-light
    mt-${spacing[1]}
    dark:text-success-dark
  `,
};

export const baseTableStyles = {
  wrapper: `
    overflow-x-auto
    rounded-${borderRadius.lg}
    border
    border-gray-200
    dark:border-gray-700
  `,
  table: `min-w-full divide-y divide-gray-200 dark:divide-gray-700`,
  thead: `bg-gray-50 dark:bg-gray-800`,
  th: `
    px-${spacing[4]}
    py-${spacing[3]}
    text-left
    text-${typography.sizes.xs}
    font-${typography.weights.medium}
    text-gray-500
    uppercase
    tracking-wider
    dark:text-gray-400
  `,
  tbody: `
    bg-white
    divide-y
    divide-gray-200
    dark:bg-gray-900
    dark:divide-gray-700
  `,
  td: `
    px-${spacing[4]}
    py-${spacing[3]}
    whitespace-nowrap
    text-${typography.sizes.sm}
    text-gray-900
    dark:text-gray-200
  `,
};

export const baseModalStyles = {
  overlay: `
    fixed
    inset-0
    bg-black
    bg-opacity-50
    backdrop-blur-sm
    transition-opacity
  `,
  content: `
    fixed
    inset-x-0
    bottom-0
    transform
    transition-all
    sm:inset-0
    sm:flex
    sm:items-center
    sm:justify-center
  `,
  panel: `
    relative
    w-full
    bg-white
    rounded-t-${borderRadius['2xl']}
    p-${spacing[6]}
    overflow-hidden
    sm:max-w-lg
    sm:rounded-${borderRadius.xl}
    dark:bg-gray-800
  `,
};

export const baseAlertStyles = {
  base: `
    rounded-${borderRadius.lg}
    p-${spacing[4]}
    mb-${spacing[4]}
    border
    flex
    items-center
  `,
  variants: {
    info: `
      bg-primary-50
      border-primary-200
      text-primary-800
      dark:bg-primary-900/50
      dark:border-primary-800
      dark:text-primary-200
    `,
    success: `
      bg-success-light/10
      border-success-light
      text-success-dark
      dark:bg-success-dark/10
      dark:border-success-dark
      dark:text-success-light
    `,
    warning: `
      bg-warning-light/10
      border-warning-light
      text-warning-dark
      dark:bg-warning-dark/10
      dark:border-warning-dark
      dark:text-warning-light
    `,
    error: `
      bg-error-light/10
      border-error-light
      text-error-dark
      dark:bg-error-dark/10
      dark:border-error-dark
      dark:text-error-light
    `,
  },
};

export const baseTooltipStyles = `
  z-${zIndex.tooltip}
  px-${spacing[2]}
  py-${spacing[1]}
  text-${typography.sizes.xs}
  font-${typography.weights.medium}
  text-white
  bg-gray-900
  rounded-${borderRadius.md}
  shadow-${shadows.lg}
  dark:bg-gray-700
`;

export const baseSkeletonStyles = `
  animate-pulse
  rounded-${borderRadius.md}
  bg-gray-200
  dark:bg-gray-700
`;

export const baseBadgeStyles = {
  base: `
    inline-flex
    items-center
    rounded-full
    px-${spacing[2]}
    py-${spacing[0.5]}
    text-${typography.sizes.xs}
    font-${typography.weights.medium}
  `,
  variants: {
    gray: `
      bg-gray-100
      text-gray-800
      dark:bg-gray-700
      dark:text-gray-200
    `,
    primary: `
      bg-primary-100
      text-primary-800
      dark:bg-primary-900
      dark:text-primary-200
    `,
    success: `
      bg-success-light/10
      text-success-dark
      dark:bg-success-dark/10
      dark:text-success-light
    `,
    error: `
      bg-error-light/10
      text-error-dark
      dark:bg-error-dark/10
      dark:text-error-light
    `,
  },
};
