import { ApplicationError } from '../errors/ApplicationError';
import { CacheService } from './CacheService';

export abstract class BaseService {
  protected static createCacheKey(prefix: string, ...args: string[]): string {
    return `${prefix}:${args.join(':')}`;
  }

  protected static handleError(
    error: unknown,
    context?: Record<string, unknown>
  ): never {
    if (error instanceof ApplicationError) {
      throw error;
    }

    const appError =
      error instanceof Error
        ? ApplicationError.fromError(error)
        : new ApplicationError('UNKNOWN_ERROR', String(error), context);

    throw appError;
  }

  protected static async withCache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl = 5 * 60 * 1000
  ): Promise<T> {
    // Check cache first
    const cachedData = CacheService.get<T>(key);
    if (cachedData) {
      return cachedData;
    }

    // Fetch fresh data
    try {
      const freshData = await fetchFn();

      // Cache the result
      CacheService.set(key, freshData, ttl);

      return freshData;
    } catch (error) {
      // Handle and rethrow errors
      this.handleError(error, { cacheKey: key });
      throw error; // This line will never be reached due to handleError
    }
  }

  protected static async retry<T>(
    fn: () => Promise<T>,
    options: {
      maxRetries?: number;
      delay?: number;
    } = {}
  ): Promise<T> {
    const { maxRetries = 3, delay = 1000 } = options;

    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // Log the error for the current attempt
        console.warn(`Attempt ${attempt} failed`, error);

        // Wait before next retry
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delay * attempt));
        }
      }
    }

    // If all retries fail, handle the final error
    return this.handleError(lastError, {
      attempts: maxRetries,
    });
  }

  // Utility method to validate input
  protected static validate<T>(
    input: T,
    validator: (input: T) => boolean,
    errorCode = 'VALIDATION_ERROR',
    errorMessage = 'Invalid input'
  ): T {
    if (!validator(input)) {
      throw new ApplicationError(errorCode, errorMessage, { input });
    }
    return input;
  }
}
