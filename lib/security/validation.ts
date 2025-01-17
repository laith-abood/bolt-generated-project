import { createHash } from 'crypto';

interface PasswordConfig {
  minPasswordLength: number;
  requirePasswordComplexity: boolean;
}

/**
 * Validates password strength and format
 * Checks:
 * - Minimum length
 * - Complexity requirements (if enabled):
 *   - At least one uppercase letter
 *   - At least one lowercase letter
 *   - At least one number
 *   - At least one special character
 */
export function validatePassword(
  password: string,
  config: PasswordConfig
): boolean {
  if (password.length < config.minPasswordLength) {
    return false;
  }

  if (config.requirePasswordComplexity) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  }

  return true;
}

/**
 * Sanitizes user input to prevent XSS and injection attacks
 * - Removes HTML tags
 * - Removes potentially dangerous characters
 * - Trims whitespace
 */
export function sanitizeInput(input: string): string {
  return (
    input
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove potentially dangerous characters
      .replace(/[<>'"`;]/g, '')
      // Convert multiple spaces to single space
      .replace(/\s+/g, ' ')
      // Trim whitespace
      .trim()
  );
}

/**
 * Creates a hash of the input string using SHA-256
 * Used for comparing values in a timing-safe way
 */
export function hashValue(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

/**
 * Validates email format
 * Uses a comprehensive regex that follows RFC 5322 standards
 */
export function validateEmail(email: string): boolean {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

/**
 * Validates that a string contains only alphanumeric characters and basic punctuation
 */
export function validateAlphanumeric(input: string): boolean {
  return /^[a-zA-Z0-9\s.,!?-]*$/.test(input);
}

/**
 * Escapes special characters in a string to prevent regex injection
 */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
