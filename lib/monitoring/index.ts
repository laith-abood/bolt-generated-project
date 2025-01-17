import { PerformanceMonitor } from './PerformanceMonitor';

export * from './PerformanceMonitor';

// Re-export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Monitoring types
export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: Date;
  success: boolean;
  metadata?: Record<string, unknown>;
}

export interface PerformanceThresholds {
  warning: number; // milliseconds
  critical: number; // milliseconds
}

export const DEFAULT_THRESHOLDS: Record<string, PerformanceThresholds> = {
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
  api: {
    warning: 300, // 300ms
    critical: 1000, // 1 second
  },
  cache: {
    warning: 100, // 100ms
    critical: 500, // 500ms
  },
};

// Utility types
export interface MonitoringOptions {
  enableMetrics?: boolean;
  enableAlerts?: boolean;
  thresholds?: Record<string, PerformanceThresholds>;
  retentionPeriod?: number; // milliseconds
  samplingRate?: number; // 0-1
}

export interface MetricsSummary {
  average: number;
  p95: number;
  p99: number;
  successRate: number;
  totalCount: number;
  errorCount: number;
}

// Type guards
export function isPerformanceMetric(obj: unknown): obj is PerformanceMetric {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'name' in obj &&
    'duration' in obj &&
    'timestamp' in obj &&
    'success' in obj &&
    obj.timestamp instanceof Date &&
    typeof obj.duration === 'number' &&
    typeof obj.success === 'boolean'
  );
}

export function isMonitoringOptions(obj: unknown): obj is MonitoringOptions {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    (!('enableMetrics' in obj) || typeof obj.enableMetrics === 'boolean') &&
    (!('enableAlerts' in obj) || typeof obj.enableAlerts === 'boolean') &&
    (!('samplingRate' in obj) ||
      (typeof obj.samplingRate === 'number' &&
        obj.samplingRate >= 0 &&
        obj.samplingRate <= 1))
  );
}
