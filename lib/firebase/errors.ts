import { FirebaseError as BaseFirebaseError } from 'firebase/app';

import type { FirebaseError } from './types';

// Custom error classes
export class FirebaseAuthError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly originalError?: FirebaseError
  ) {
    super(message);
    this.name = 'FirebaseAuthError';
  }
}

export class FirestoreError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly originalError?: FirebaseError
  ) {
    super(message);
    this.name = 'FirestoreError';
  }
}

export class AnalyticsError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly originalError?: FirebaseError
  ) {
    super(message);
    this.name = 'AnalyticsError';
  }
}

// Error handler class
export class FirebaseErrorHandler {
  private static readonly AUTH_ERROR_MESSAGES: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email address',
    'auth/wrong-password': 'Invalid password',
    'auth/email-already-in-use': 'An account already exists with this email',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/invalid-email': 'Invalid email address',
    'auth/operation-not-allowed': 'Operation not allowed',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/network-request-failed':
      'Network error. Please check your connection',
  };

  private static readonly FIRESTORE_ERROR_MESSAGES: Record<string, string> = {
    'permission-denied': 'You do not have permission to perform this operation',
    'not-found': 'The requested document was not found',
    'already-exists': 'The document already exists',
    'failed-precondition': 'Operation failed due to document state',
    aborted: 'Transaction was aborted',
    'out-of-range': 'Query limit out of range',
    unavailable: 'Service temporarily unavailable',
    'data-loss': 'Unrecoverable data loss or corruption',
  };

  public static handleAuthError(error: BaseFirebaseError): FirebaseAuthError {
    const code = error.code || 'auth/unknown';
    const message =
      this.AUTH_ERROR_MESSAGES[code] ||
      error.message ||
      'Authentication failed';

    return new FirebaseAuthError(code, message, error);
  }

  public static handleFirestoreError(error: BaseFirebaseError): FirestoreError {
    const code = error.code || 'unknown';
    const message =
      this.FIRESTORE_ERROR_MESSAGES[code] ||
      error.message ||
      'Database operation failed';

    return new FirestoreError(code, message, error);
  }

  public static handleAnalyticsError(error: BaseFirebaseError): AnalyticsError {
    const code = error.code || 'analytics/unknown';
    const message = error.message || 'Analytics operation failed';

    return new AnalyticsError(code, message, error);
  }

  public static isRetryableError(error: BaseFirebaseError): boolean {
    const retryableCodes = [
      'deadline-exceeded',
      'unavailable',
      'internal',
      'resource-exhausted',
    ];

    return retryableCodes.includes(error.code);
  }

  public static async withRetry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (
          error instanceof BaseFirebaseError &&
          this.isRetryableError(error) &&
          attempt < maxAttempts
        ) {
          // Exponential backoff with jitter
          const delay = Math.min(
            baseDelay * Math.pow(2, attempt - 1) * (0.5 + Math.random()),
            30000 // Max delay of 30 seconds
          );

          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        throw error;
      }
    }

    throw lastError || new Error('Operation failed after retries');
  }

  public static logError(
    error: Error,
    context: Record<string, unknown> = {}
  ): void {
    // Add your error logging logic here (e.g., to a monitoring service)
    console.error('Firebase Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof BaseFirebaseError && { code: error.code }),
      context,
    });
  }
}
