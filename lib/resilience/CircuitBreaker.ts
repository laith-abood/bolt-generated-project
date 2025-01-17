import { clearInterval, setInterval, setTimeout } from 'timers';

import { ErrorHandler } from '../errors/ErrorHandler';
import { PerformanceMonitor } from '../monitoring/PerformanceMonitor';

interface CircuitBreakerOptions {
  failureThreshold: number; // Number of failures before opening
  resetTimeout: number; // Time in ms before attempting reset
  monitorInterval: number; // Time in ms between health checks
  timeout: number; // Operation timeout in ms
}

type CircuitState = 'closed' | 'open' | 'half-open';

export interface CircuitStats {
  state: CircuitState;
  failures: number;
  lastFailure: number | null;
  successes: number;
  lastSuccess: number | null;
  lastReset: number | null;
}

const DEFAULT_OPTIONS: CircuitBreakerOptions = {
  failureThreshold: 5,
  resetTimeout: 60000, // 1 minute
  monitorInterval: 15000, // 15 seconds
  timeout: 5000, // 5 seconds
};

export class CircuitBreaker {
  private state: CircuitState = 'closed';
  private failures = 0;
  private successes = 0;
  private lastFailure: number | null = null;
  private lastSuccess: number | null = null;
  private lastReset: number | null = null;
  private monitorTimer: ReturnType<typeof setInterval> | null = null;
  private performanceMonitor: PerformanceMonitor;

  constructor(
    private readonly name: string,
    private readonly options: CircuitBreakerOptions = DEFAULT_OPTIONS
  ) {
    this.performanceMonitor = PerformanceMonitor.getInstance();
    this.startMonitoring();
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.transitionToHalfOpen();
      } else {
        throw new Error(`Circuit breaker for ${this.name} is open`);
      }
    }

    return this.performanceMonitor.trackOperation(
      `circuit_breaker_${this.name}`,
      async () => {
        try {
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(
                new Error(`Operation timed out after ${this.options.timeout}ms`)
              );
            }, this.options.timeout);
          });

          const result = await Promise.race([operation(), timeoutPromise]);
          await this.recordSuccess();
          return result;
        } catch (error) {
          await this.recordFailure(error as Error);
          throw error;
        }
      }
    );
  }

  getStats(): CircuitStats {
    return {
      state: this.state,
      failures: this.failures,
      lastFailure: this.lastFailure,
      successes: this.successes,
      lastSuccess: this.lastSuccess,
      lastReset: this.lastReset,
    };
  }

  private async recordSuccess(): Promise<void> {
    this.successes++;
    this.lastSuccess = Date.now();

    if (this.state === 'half-open') {
      this.transitionToClosed();
    }
  }

  private async recordFailure(error: Error): Promise<void> {
    this.failures++;
    this.lastFailure = Date.now();

    await this.handleError(error);

    if (this.failures >= this.options.failureThreshold) {
      this.transitionToOpen();
    }
  }

  private async handleError(
    error: Error,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await ErrorHandler.handleError(error, {
      action: 'circuit_breaker_error',
      metadata: {
        state: this.state,
        failureCount: this.failures,
        ...metadata,
      },
    });
  }

  private async handleStateTransition(
    fromState: string,
    toState: string
  ): Promise<void> {
    void ErrorHandler.handleError(
      new Error(`Circuit breaker state transition: ${fromState} -> ${toState}`),
      {
        action: 'circuit_breaker_state_transition',
        metadata: {
          fromState,
          toState,
          failureCount: this.failures,
        },
      }
    );
  }

  private transitionToOpen(): void {
    if (this.state !== 'open') {
      this.state = 'open';
      void this.handleStateTransition('closed', 'open');
    }
  }

  private transitionToHalfOpen(): void {
    this.state = 'half-open';
    this.failures = 0;
    this.successes = 0;
    void this.handleStateTransition('closed', 'half-open');
  }

  private transitionToClosed(): void {
    this.state = 'closed';
    this.failures = 0;
    this.lastReset = Date.now();
    void this.handleStateTransition('open', 'closed');
  }

  private shouldAttemptReset(): boolean {
    return (
      this.lastFailure !== null &&
      Date.now() - this.lastFailure >= this.options.resetTimeout
    );
  }

  private startMonitoring(): void {
    this.monitorTimer = setInterval(() => {
      void this.performanceMonitor.trackOperation(
        `circuit_breaker_${this.name}_monitor`,
        async () => {
          const stats = this.getStats();
          if (stats.state === 'open' && this.shouldAttemptReset()) {
            this.transitionToHalfOpen();
          }
        }
      );
    }, this.options.monitorInterval);
  }

  destroy(): void {
    if (this.monitorTimer) {
      clearInterval(this.monitorTimer);
      this.monitorTimer = null;
    }
  }
}

// Export a factory function to create circuit breakers
export const createCircuitBreaker = (
  name: string,
  options?: CircuitBreakerOptions
): CircuitBreaker => {
  return new CircuitBreaker(name, options);
};
