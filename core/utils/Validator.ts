import { z } from 'zod';

import { ApplicationError } from '../errors/ApplicationError';

export class Validator {
  // Generic validation method using Zod
  static validate<T>(
    data: unknown,
    schema: z.ZodType<T>,
    errorCode = 'VALIDATION_ERROR'
  ): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ApplicationError(errorCode, 'Validation failed', {
          issues: error.errors.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      throw error;
    }
  }

  // Email validation
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Password strength validation
  static isStrongPassword(password: string): boolean {
    // At least 8 characters, one uppercase, one lowercase, one number, one special char
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  // Phone number validation (basic)
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  }

  // URL validation
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Common schemas for reusable validations
  static schemas = {
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[0-9]/, 'Password must contain a number')
      .regex(/[@$!%*?&]/, 'Password must contain a special character'),

    phoneNumber: z
      .string()
      .regex(
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        'Invalid phone number'
      ),

    url: z.string().url('Invalid URL'),
  };

  // Sanitization methods
  static sanitizeInput(input: string): string {
    // Remove potentially dangerous HTML and script tags
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  // Create a custom validator with specific error messages
  static createCustomValidator<T>(
    validator: (value: T) => boolean,
    errorMessage = 'Validation failed'
  ): (value: T) => T {
    return (value: T) => {
      if (!validator(value)) {
        throw new ApplicationError('CUSTOM_VALIDATION_ERROR', errorMessage, {
          value,
        });
      }
      return value;
    };
  }
}
