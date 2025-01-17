/**
 * Utility functions for ARIA attributes and accessibility
 */

/**
 * Generates a unique ID for ARIA attributes
 */
export function generateAriaId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Creates an array of IDs for aria-describedby
 */
export function createAriaDescribedBy(
  ids: (string | undefined | false)[]
): string | undefined {
  const validIds = ids.filter(Boolean);
  return validIds.length > 0 ? validIds.join(' ') : undefined;
}

/**
 * Determines if an element should be hidden from screen readers
 */
export function getAriaHidden(isHidden: boolean): true | undefined {
  return isHidden ? true : undefined;
}

/**
 * Converts a boolean or string to a valid aria-invalid value
 */
export function getAriaInvalid(
  value: boolean | string | undefined
): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value === 'true';
  }
  return undefined;
}

/**
 * Converts a boolean or string to a valid aria-required value
 */
export function getAriaRequired(
  value: boolean | string | undefined
): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value === 'true';
  }
  return undefined;
}

/**
 * Converts a boolean or string to a valid aria-expanded value
 */
export function getAriaExpanded(
  value: boolean | string | undefined
): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value === 'true';
  }
  return undefined;
}

/**
 * Converts a boolean or string to a valid aria-selected value
 */
export function getAriaSelected(
  value: boolean | string | undefined
): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value === 'true';
  }
  return undefined;
}

/**
 * Converts a boolean or string to a valid aria-pressed value
 */
export function getAriaPressed(
  value: boolean | string | undefined
): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value === 'true';
  }
  return undefined;
}

/**
 * Converts a boolean or string to a valid aria-checked value
 */
export function getAriaChecked(
  value: boolean | string | undefined
): boolean | 'mixed' | undefined {
  if (typeof value === 'boolean') {
    return value;
  }
  if (value === 'mixed') {
    return 'mixed';
  }
  if (typeof value === 'string') {
    return value === 'true';
  }
  return undefined;
}

/**
 * Converts a boolean or string to a valid aria-disabled value
 */
export function getAriaDisabled(
  value: boolean | string | undefined
): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value === 'true';
  }
  return undefined;
}

/**
 * Converts a boolean or string to a valid aria-busy value
 */
export function getAriaBusy(
  value: boolean | string | undefined
): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value === 'true';
  }
  return undefined;
}
