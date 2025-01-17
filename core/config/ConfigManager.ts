import { z } from 'zod';

import { ApplicationError } from '../errors/ApplicationError';
import { LogLevel, LoggerService } from '../services/LoggerService';

export class ConfigManager {
  // Base configuration schema
  private static baseSchema = z.object({
    // Common configuration properties
    appName: z.string().default('Medicare Call Tracker'),
    environment: z
      .enum(['development', 'staging', 'production'])
      .default('development'),
    debug: z.boolean().default(false),

    // Logging configuration
    logging: z
      .object({
        level: z.nativeEnum(LogLevel).default(LogLevel.INFO),
        enabled: z.boolean().default(true),
      })
      .default({}),

    // Feature flags
    features: z.record(z.string(), z.boolean()).optional(),

    // External service configurations
    services: z
      .object({
        firebase: z
          .object({
            apiKey: z.string(),
            authDomain: z.string(),
            projectId: z.string(),
            storageBucket: z.string().optional(),
            messagingSenderId: z.string().optional(),
            appId: z.string().optional(),
          })
          .optional(),

        monitoring: z
          .object({
            enabled: z.boolean().default(false),
            endpoint: z.string().url().optional(),
          })
          .default({}),
      })
      .optional(),
  });

  // Singleton instance of configuration
  private static instance: z.infer<typeof ConfigManager.baseSchema>;

  // Private constructor to prevent direct instantiation
  private constructor() {}

  // Initialize configuration
  static initialize(
    customConfig: Partial<z.infer<typeof ConfigManager.baseSchema>> = {}
  ): void {
    try {
      // Merge default config with custom config
      this.instance = this.baseSchema.parse({
        ...this.baseSchema.parse({}),
        ...customConfig,
      });

      // Configure logger based on config
      if (this.instance.logging.enabled) {
        LoggerService.log(LogLevel.INFO, 'Configuration initialized', {
          environment: this.instance.environment,
        });
      }
    } catch (error) {
      // Handle configuration validation errors
      if (error instanceof z.ZodError) {
        const validationErrors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        throw new ApplicationError(
          'CONFIG_VALIDATION_ERROR',
          'Invalid configuration',
          { validationErrors }
        );
      }
      throw error;
    }
  }

  // Get a specific configuration value
  static get<K extends keyof z.infer<typeof ConfigManager.baseSchema>>(
    key: K
  ): z.infer<typeof ConfigManager.baseSchema>[K] {
    if (!this.instance) {
      throw new ApplicationError(
        'CONFIG_NOT_INITIALIZED',
        'Configuration not initialized. Call initialize() first.'
      );
    }
    return this.instance[key];
  }

  // Check if a feature is enabled
  static isFeatureEnabled(featureName: string): boolean {
    const features = this.get('features') || {};
    return !!features[featureName];
  }

  // Update configuration at runtime
  static update(
    updates: Partial<z.infer<typeof ConfigManager.baseSchema>>
  ): void {
    if (!this.instance) {
      throw new ApplicationError(
        'CONFIG_NOT_INITIALIZED',
        'Configuration not initialized. Call initialize() first.'
      );
    }

    try {
      this.instance = this.baseSchema.parse({
        ...this.instance,
        ...updates,
      });

      // Log configuration update
      LoggerService.log(LogLevel.INFO, 'Configuration updated', {
        updatedKeys: Object.keys(updates),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        throw new ApplicationError(
          'CONFIG_UPDATE_ERROR',
          'Invalid configuration update',
          { validationErrors }
        );
      }
      throw error;
    }
  }

  // Export current configuration (for debugging/logging)
  static export(): z.infer<typeof ConfigManager.baseSchema> {
    if (!this.instance) {
      throw new ApplicationError(
        'CONFIG_NOT_INITIALIZED',
        'Configuration not initialized. Call initialize() first.'
      );
    }

    // Create a deep copy to prevent direct mutation
    return JSON.parse(JSON.stringify(this.instance));
  }
}

// Optional: Provide a default initialization
ConfigManager.initialize({
  environment:
    (process.env.NODE_ENV as 'development' | 'staging' | 'production') ||
    'development',
  debug: process.env.NODE_ENV !== 'production',
  logging: {
    level:
      process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
    enabled: process.env.NODE_ENV !== 'production',
  },
});
