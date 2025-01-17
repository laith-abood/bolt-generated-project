import type { NextApiRequest, NextApiResponse } from 'next';

import { Cache } from '../cache/Cache';
import { ErrorHandler } from '../errors/ErrorHandler';

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyPrefix?: string; // Redis key prefix
  statusCode?: number; // HTTP status code when limit exceeded
  message?: string; // Error message when limit exceeded
  headers?: boolean; // Whether to include rate limit headers
}

export class RateLimiter {
  private cache: Cache;
  private config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig) {
    this.cache = Cache.getInstance();

    this.config = {
      keyPrefix: 'ratelimit:',
      statusCode: 429,
      message: 'Too many requests, please try again later.',
      headers: true,
      ...config,
    };
  }

  private getKey(identifier: string): string {
    return `${this.config.keyPrefix}${identifier}`;
  }

  private getWindowStart(): number {
    return Math.floor(Date.now() / this.config.windowMs);
  }

  async isRateLimited(identifier: string): Promise<{
    limited: boolean;
    remaining: number;
    reset: number;
  }> {
    try {
      const key = this.getKey(identifier);
      const windowStart = this.getWindowStart();
      const windowKey = `${key}:${windowStart}`;

      // Get current count
      let count = (await this.cache.get<number>(windowKey)) || 0;
      count++;

      // Update count and set expiry
      await this.cache.set(windowKey, count);

      // Calculate remaining requests and reset time
      const remaining = Math.max(0, this.config.maxRequests - count);
      const reset = (windowStart + 1) * this.config.windowMs;

      return {
        limited: count > this.config.maxRequests,
        remaining,
        reset,
      };
    } catch (error) {
      await ErrorHandler.handleError(error as Error, {
        code: 'INTERNAL_ERROR',
        context: {
          operation: 'rate_limit_check',
          identifier,
          service: 'RateLimiter',
        },
      });
      // Fail open if Redis is down
      return {
        limited: false,
        remaining: this.config.maxRequests,
        reset: Date.now() + this.config.windowMs,
      };
    }
  }

  middleware() {
    return async (
      req: NextApiRequest,
      res: NextApiResponse,
      next: () => Promise<void>
    ) => {
      try {
        // Get identifier from IP or auth token
        const identifier =
          req.headers.authorization || req.socket.remoteAddress || 'unknown';

        const { limited, remaining, reset } =
          await this.isRateLimited(identifier);

        // Add rate limit headers if enabled
        if (this.config.headers) {
          res.setHeader(
            'X-RateLimit-Limit',
            this.config.maxRequests.toString()
          );
          res.setHeader('X-RateLimit-Remaining', remaining.toString());
          res.setHeader('X-RateLimit-Reset', reset.toString());
        }

        if (limited) {
          res.status(this.config.statusCode).json({
            error: this.config.message,
            retryAfter: Math.ceil((reset - Date.now()) / 1000),
          });
          return;
        }

        await next();
      } catch (error) {
        await ErrorHandler.handleError(error as Error, {
          code: 'INTERNAL_ERROR',
          context: {
            operation: 'rate_limit_middleware',
            service: 'RateLimiter',
          },
        });
        // Fail open
        await next();
      }
    };
  }
}

// Factory function to create rate limiter instances
export function createRateLimiter(config: RateLimitConfig): RateLimiter {
  return new RateLimiter(config);
}

// Default rate limiter for API routes
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
  keyPrefix: 'api:',
  headers: true,
});

// Stricter rate limiter for authentication routes
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
  keyPrefix: 'auth:',
  message: 'Too many login attempts, please try again later.',
  headers: true,
});
