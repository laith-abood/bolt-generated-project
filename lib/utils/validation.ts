import { z } from 'zod';

import { ErrorLogger } from '@/lib/errors/logger';

export interface ValidationError {
  path: Array<string | number>;
  message: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

/**
 * Validates data against a Zod schema and returns a structured result
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @param context Optional context for error logging
 */
export function validateData<T>(
  schema: z.ZodType<T>,
  data: unknown,
  context?: string
): ValidationResult<T> {
  try {
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        path: err.path,
        message: err.message,
      }));

      // Log validation errors if context is provided
      if (context) {
        void ErrorLogger.logError(new Error('Validation failed'), {
          context,
          errors,
          data,
        });
      }

      return {
        success: false,
        errors,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Validation failed');

    if (context) {
      void ErrorLogger.logError(error, {
        context,
        data,
      });
    }

    return {
      success: false,
      errors: [
        {
          path: [],
          message: error.message,
        },
      ],
    };
  }
}

/**
 * Formats validation errors into a user-friendly object
 * @param errors Array of validation errors
 * @returns Object mapping field paths to error messages
 */
export function formatValidationErrors(
  errors: ValidationError[]
): Record<string, string> {
  return errors.reduce(
    (acc, error) => {
      const path = error.path.join('.');
      if (!acc[path]) {
        acc[path] = error.message;
      }
      return acc;
    },
    {} as Record<string, string>
  );
}

/**
 * Gets the first error message for a specific field
 * @param errors Validation errors object
 * @param field Field path to check
 * @returns First error message or undefined
 */
export function getFieldError(
  errors: Record<string, string>,
  field: string
): string | undefined {
  return errors[field];
}

/**
 * Checks if a field has any validation errors
 * @param errors Validation errors object
 * @param field Field path to check
 * @returns True if field has errors
 */
export function hasFieldError(
  errors: Record<string, string>,
  field: string
): boolean {
  return field in errors;
}

/**
 * Validates a single field value
 * @param schema Schema for the field
 * @param value Field value
 * @returns Validation error message or undefined
 */
export function validateField<T>(
  schema: z.ZodType<T>,
  value: unknown
): string | undefined {
  const result = validateData(schema, value);
  return result.success ? undefined : result.errors?.[0]?.message;
}

/**
 * Type guard to check if a value is a ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'path' in error &&
    Array.isArray((error as ValidationError).path) &&
    'message' in error &&
    typeof (error as ValidationError).message === 'string'
  );
}

/**
 * Type guard to check if a value is an array of ValidationErrors
 */
export function isValidationErrorArray(
  errors: unknown
): errors is ValidationError[] {
  return Array.isArray(errors) && errors.every(isValidationError);
}

/**
 * Helper to extract a field schema from an object schema
 * @param schema Object schema
 * @param field Field name
 * @returns Field schema or undefined
 */
export function getFieldSchema<
  T extends z.ZodRawShape,
  K extends keyof z.infer<z.ZodObject<T>>,
>(schema: z.ZodObject<T>, field: K): z.ZodTypeAny | undefined {
  return schema.shape[field as string];
}

// Validation helpers
export const isValidEmail = (email: string): boolean => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
};

export const isStrongPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

export const isValidName = (name: string): boolean => {
  return /^[a-zA-Z\s-']{2,100}$/.test(name);
};

export const isValidAgencyName = (name: string): boolean => {
  return /^[a-zA-Z0-9\s-'&]{2,100}$/.test(name);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  return /^\+?[1-9]\d{1,14}$/.test(phone);
};

export const isValidDate = (date: string): boolean => {
  const parsed = Date.parse(date);
  return !isNaN(parsed) && /^\d{4}-\d{2}-\d{2}$/.test(date);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeHtml = (html: string): string => {
  return html.replace(/[<>]/g, '');
};
