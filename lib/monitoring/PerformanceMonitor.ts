import { ErrorHandler } from '../errors/ErrorHandler';

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: Date;
  success: boolean;
  metadata?: Record<string, unknown>;
}

interface PerformanceThresholds {
  warning: number; // milliseconds
  critical: number; // milliseconds
}

const DEFAULT_THRESHOLDS: Record<string, PerformanceThresholds> = {
  default: {
    warning: 1000, // 1 second
    critical: 3000, // 3 seconds
  },
  database: {
    warning: 500, // 500ms
    critical: 1000, // 1 second
  },
  authentication: {
    warning: 800, // 800ms
    critical: 2000, // 2 seconds
  },
};

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private readonly METRICS_RETENTION = 1000; // Keep last 1000 metrics

  private constructor() {
    this.startPeriodicCleanup();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  async trackOperation<T>(
    name: string,
    operation: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    const start = performance.now();
    let success = false;

    try {
      const result = await operation();
      success = true;
      return result;
    } finally {
      const duration = performance.now() - start;
      await this.recordMetric({
        name,
        duration,
        timestamp: new Date(),
        success,
        metadata,
      });
    }
  }

  async getMetrics(
    options: {
      name?: string;
      startTime?: Date;
      endTime?: Date;
      successOnly?: boolean;
    } = {}
  ): Promise<PerformanceMetric[]> {
    let filteredMetrics = this.metrics;

    if (options.name) {
      filteredMetrics = filteredMetrics.filter((m) => m.name === options.name);
    }
    if (options.startTime) {
      filteredMetrics = filteredMetrics.filter(
        (m) => m.timestamp >= options.startTime!
      );
    }
    if (options.endTime) {
      filteredMetrics = filteredMetrics.filter(
        (m) => m.timestamp <= options.endTime!
      );
    }
    if (options.successOnly) {
      filteredMetrics = filteredMetrics.filter((m) => m.success);
    }

    return filteredMetrics;
  }

  async getAverageMetrics(
    name: string,
    window: number = 60000
  ): Promise<{
    average: number;
    p95: number;
    p99: number;
    successRate: number;
  }> {
    const now = Date.now();
    const relevantMetrics = this.metrics.filter(
      (m) => m.name === name && now - m.timestamp.getTime() <= window
    );

    if (relevantMetrics.length === 0) {
      return { average: 0, p95: 0, p99: 0, successRate: 0 };
    }

    const durations = relevantMetrics
      .map((m) => m.duration)
      .sort((a, b) => a - b);
    const successCount = relevantMetrics.filter((m) => m.success).length;

    return {
      average: durations.reduce((a, b) => a + b, 0) / durations.length,
      p95: durations[Math.floor(durations.length * 0.95)],
      p99: durations[Math.floor(durations.length * 0.99)],
      successRate: (successCount / relevantMetrics.length) * 100,
    };
  }

  private async recordMetric(metric: PerformanceMetric): Promise<void> {
    try {
      this.metrics.push(metric);

      // Trim metrics if exceeding retention limit
      if (this.metrics.length > this.METRICS_RETENTION) {
        this.metrics = this.metrics.slice(-this.METRICS_RETENTION);
      }

      // Check thresholds
      await this.checkThresholds(metric);
    } catch (error) {
      await this.handleError(error as Error, {
        action: 'record_metric',
        metadata: { metricName: metric.name },
      });
    }
  }

  private async checkThresholds(metric: PerformanceMetric): Promise<void> {
    const thresholds =
      DEFAULT_THRESHOLDS[metric.name] || DEFAULT_THRESHOLDS.default;

    if (metric.duration >= thresholds.critical) {
      await this.handleThresholdExceeded(metric);
    } else if (metric.duration >= thresholds.warning) {
      console.warn(
        `Warning: Performance threshold exceeded for ${metric.name}`,
        {
          duration: metric.duration,
          threshold: thresholds.warning,
          ...metric.metadata,
        }
      );
    }
  }

  private startPeriodicCleanup(): void {
    setInterval(
      () => {
        const now = Date.now();
        this.metrics = this.metrics.filter(
          (m) => now - m.timestamp.getTime() <= 24 * 60 * 60 * 1000 // Keep last 24 hours
        );
      },
      60 * 60 * 1000
    ); // Run every hour
  }

  // For testing and cleanup
  destroy(): void {
    this.metrics = [];
  }

  private async handleError(
    error: Error,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await ErrorHandler.handleError(error, {
      action: 'performance_monitor_error',
      metadata,
    });
  }

  private async handleThresholdExceeded(
    metric: PerformanceMetric
  ): Promise<void> {
    await ErrorHandler.handleError(
      new Error(`Critical performance threshold exceeded for ${metric.name}`),
      {
        action: 'performance_threshold_exceeded',
        metadata: {
          metric: metric.name,
          value: metric.duration,
          threshold: metric.duration,
        },
      }
    );
  }
}

// Export a singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();
