import { z } from 'zod';

import { ErrorLogger } from '@/lib/errors/logger';

const envSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().min(1),
  FIREBASE_ADMIN_PROJECT_ID: z.string().min(1),
  FIREBASE_ADMIN_CLIENT_EMAIL: z.string().email(),
  FIREBASE_ADMIN_PRIVATE_KEY: z.string().min(1),
  NEXT_PUBLIC_NODE_ENV: z.enum(['development', 'production']),
});

type EnvConfig = z.infer<typeof envSchema>;

class ConfigValidator {
  private static instance: ConfigValidator;
  private config: EnvConfig | null = null;

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): ConfigValidator {
    if (!ConfigValidator.instance) {
      ConfigValidator.instance = new ConfigValidator();
    }
    return ConfigValidator.instance;
  }

  public validateEnv(): EnvConfig {
    if (this.config) {
      return this.config;
    }

    // In browser environment, only validate public variables
    if (typeof window !== 'undefined') {
      const publicEnv = {
        NEXT_PUBLIC_FIREBASE_API_KEY:
          process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
          process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
        NEXT_PUBLIC_FIREBASE_PROJECT_ID:
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
          process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
          process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
        NEXT_PUBLIC_FIREBASE_APP_ID:
          process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
          process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? '',
        NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV ?? 'development',
        // Add dummy values for server-only env vars in browser
        FIREBASE_ADMIN_PROJECT_ID: 'browser',
        FIREBASE_ADMIN_CLIENT_EMAIL: 'browser@example.com',
        FIREBASE_ADMIN_PRIVATE_KEY: 'browser',
      };

      const parsed = envSchema.safeParse(publicEnv);
      if (!parsed.success) {
        const error = new Error('Invalid public environment variables');
        void ErrorLogger.logError(error, {
          errors: parsed.error.flatten().fieldErrors,
          context: 'ConfigValidator.validateEnv',
        });
        throw error;
      }

      this.config = parsed.data;
      return this.config;
    }

    // Server environment - validate all variables
    const env = {
      NEXT_PUBLIC_FIREBASE_API_KEY:
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID:
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
      NEXT_PUBLIC_FIREBASE_APP_ID:
        process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
        process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? '',
      NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV ?? 'development',
      FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID ?? '',
      FIREBASE_ADMIN_CLIENT_EMAIL:
        process.env.FIREBASE_ADMIN_CLIENT_EMAIL ?? '',
      FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? '',
    };

    const parsed = envSchema.safeParse(env);
    if (!parsed.success) {
      const error = new Error('Invalid environment variables');
      void ErrorLogger.logError(error, {
        errors: parsed.error.flatten().fieldErrors,
        context: 'ConfigValidator.validateEnv',
      });
      throw error;
    }

    this.config = parsed.data;
    return this.config;
  }

  public getConfig(): EnvConfig {
    if (!this.config) {
      return this.validateEnv();
    }
    return this.config;
  }
}

export const configValidator = ConfigValidator.getInstance();

// Remove environment validation from schemas.ts and export only the validation schemas
export {
  userSchema,
  agencySchema,
  agencySettingsSchema,
  saleSchema,
  submissionSchema,
  sessionSchema,
  loginFormSchema,
  registrationFormSchema,
  addAgentFormSchema,
} from './schemas';
