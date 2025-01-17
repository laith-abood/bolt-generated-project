/**
 * Format a number as a percentage
 * @param value - The decimal value to format (e.g., 0.123 for 12.3%)
 * @param decimals - Number of decimal places to show (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a number as currency (USD)
 * @param value - The number to format
 * @param options - Intl.NumberFormat options
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

/**
 * Format a date in a consistent way
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {}
): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(date);
}

/**
 * Format a number with commas and optional decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a duration in milliseconds to a human-readable string
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

/**
 * Format a phone number in a consistent way
 * @param phone - Phone number to format
 * @param options - Formatting options
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(
  phone: string,
  options: {
    format?: 'national' | 'international';
    separator?: string;
  } = {}
): string {
  const { format = 'national', separator = '-' } = options;
  const cleaned = phone.replace(/\D/g, '');

  if (format === 'international' && cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} ${cleaned.slice(1, 4)}${separator}${cleaned.slice(4, 7)}${separator}${cleaned.slice(7)}`;
  }

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}${separator}${cleaned.slice(6)}`;
  }

  return phone;
}
