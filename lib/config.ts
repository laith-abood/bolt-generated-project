import { z } from 'zod';

// Environment configuration schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string(),
  FIREBASE_ADMIN_PROJECT_ID: z.string(),
  FIREBASE_ADMIN_CLIENT_EMAIL: z.string(),
  FIREBASE_ADMIN_PRIVATE_KEY: z.string(),
});

// App configuration
export const config = {
  env: envSchema.parse(process.env),
  app: {
    name: 'Medicare Call Tracker',
    description: 'Track and manage Medicare calls efficiently',
    version: '1.0.0',
  },
  auth: {
    sessionDuration: 24 * 60 * 60 * 1000, // 24 hours
    refreshTokenInterval: 30 * 60 * 1000, // 30 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 10000, // 10 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },
  cache: {
    defaultTTL: 5 * 60, // 5 minutes
    maxSize: 100, // Maximum number of items in cache
  },
  monitoring: {
    logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  },
  validation: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  },
} as const;

// Type for the entire config object
export type Config = typeof config;

// Helper to get strongly typed config values
export function getConfig<T extends keyof Config>(key: T): Config[T] {
  return config[key];
}
