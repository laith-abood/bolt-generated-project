import fetch from 'node-fetch';
import type { RequestInit } from 'node-fetch';
import { setTimeout } from 'timers';

import { ErrorHandler } from '../errors/ErrorHandler';
import { CircuitBreaker, type CircuitStats } from './CircuitBreaker';

interface ServiceConfig {
  name: string;
  baseUrl: string;
  timeout?: number;
  retries?: number;
  circuitBreaker?: {
    failureThreshold?: number;
    resetTimeout?: number;
    monitorInterval?: number;
  };
}

interface RetryConfig {
  maxAttempts: number;
  backoffMs: number;
  maxBackoffMs: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  backoffMs: 1000,
  maxBackoffMs: 10000,
};

export class ExternalService {
  private circuitBreaker: CircuitBreaker;
  private retryConfig: RetryConfig;

  constructor(private config: ServiceConfig) {
    this.circuitBreaker = new CircuitBreaker(config.name, {
      failureThreshold: config.circuitBreaker?.failureThreshold ?? 5,
      resetTimeout: config.circuitBreaker?.resetTimeout ?? 60000,
      monitorInterval: config.circuitBreaker?.monitorInterval ?? 15000,
      timeout: config.timeout ?? 5000,
    });
    this.retryConfig = {
      ...DEFAULT_RETRY_CONFIG,
      maxAttempts: config.retries ?? DEFAULT_RETRY_CONFIG.maxAttempts,
    };
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.circuitBreaker.execute(async () => {
      let lastError: Error | null = null;
      let attempt = 0;

      while (attempt < this.retryConfig.maxAttempts) {
        try {
          const response = await fetch(`${this.config.baseUrl}${path}`, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              ...options.headers,
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return (await response.json()) as T;
        } catch (error) {
          lastError = error as Error;
          attempt++;

          if (attempt < this.retryConfig.maxAttempts) {
            const backoff = Math.min(
              this.retryConfig.backoffMs * Math.pow(2, attempt - 1),
              this.retryConfig.maxBackoffMs
            );

            await this.handleError(error as Error, {
              action: `${this.config.name}_request_retry`,
              metadata: {
                attempt,
                maxAttempts: this.retryConfig.maxAttempts,
                backoff,
                path,
              },
            });

            await new Promise((resolve) => setTimeout(resolve, backoff));
          }
        }
      }

      throw lastError ?? new Error('Request failed after retries');
    });
  }

  async get<T>(
    path: string,
    options: Omit<RequestInit, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  async post<T>(
    path: string,
    body: unknown,
    options: Omit<RequestInit, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(
    path: string,
    body: unknown,
    options: Omit<RequestInit, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(
    path: string,
    options: Omit<RequestInit, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  getStats(): CircuitStats {
    return this.circuitBreaker.getStats();
  }

  destroy(): void {
    this.circuitBreaker.destroy();
  }

  private async handleError(
    error: Error,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await ErrorHandler.handleError(error, {
      action: 'external_service_error',
      metadata: {
        service: this.config.name,
        ...metadata,
      },
    });
  }
}

// Export a factory function to create external services
export const createExternalService = (
  config: ServiceConfig
): ExternalService => {
  return new ExternalService(config);
};
