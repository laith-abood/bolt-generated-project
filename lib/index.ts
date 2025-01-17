// Re-export all public APIs
import { ErrorHandler } from './errors';
import { performanceMonitor } from './monitoring';

// Security
export {
  createRateLimiter,
  encrypt,
  decrypt,
  generateSecureToken,
  generateKeyPair,
  hashPassword,
  verifyPassword,
  generateSecureRandom,
  generateSecureString,
} from './security';

// Error Handling
export { ErrorHandler } from './errors';
export type { ErrorCode, ErrorMetadata, ErrorResponse } from './errors';
export { errorService } from './errors';

// Performance Monitoring
export {
  performanceMonitor,
  type PerformanceMetric,
  type PerformanceThresholds,
  DEFAULT_THRESHOLDS,
  type MonitoringOptions,
  type MetricsSummary,
} from './monitoring';

// Initialize all services
export const initializeServices = async (): Promise<boolean> => {
  try {
    // Track initialization in performance monitor
    return await performanceMonitor.trackOperation(
      'initialize_services',
      async () => {
        // Initialize services
        return true;
      }
    );
  } catch (error) {
    await ErrorHandler.handleError(error as Error, {
      action: 'initialize_services',
      metadata: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    throw error;
  }
};

// Cleanup all services
export const cleanupServices = async (): Promise<boolean> => {
  try {
    return await performanceMonitor.trackOperation(
      'cleanup_services',
      async () => {
        // Cleanup services
        return true;
      }
    );
  } catch (error) {
    await ErrorHandler.handleError(error as Error, {
      action: 'cleanup_services',
      metadata: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    throw error;
  }
};
