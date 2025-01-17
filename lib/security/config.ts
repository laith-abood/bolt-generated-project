import { z } from 'zod';

export const securityConfigSchema = z.object({
  session: z.object({
    maxAge: z.number().min(0),
    inactivityTimeout: z.number().min(0),
    maxConcurrentSessions: z.number().min(1),
    requireMFAForSensitiveOperations: z.boolean(),
  }),
  rateLimit: z.object({
    maxLoginAttempts: z.number().min(1),
    lockoutDuration: z.number().min(0),
    ipBlockThreshold: z.number().min(1),
    ipBlockDuration: z.number().min(0),
  }),
  password: z.object({
    minLength: z.number().min(8),
    maxAge: z.number().min(0),
    preventReuse: z.number().min(0),
    requireComplexity: z.boolean(),
  }),
  mfa: z.object({
    enabled: z.boolean(),
    methods: z.array(z.enum(['sms', 'email', 'authenticatorApp'])),
    requireMFAForSensitiveOperations: z.boolean(),
  }),
});

export type SecurityConfig = z.infer<typeof securityConfigSchema>;

export const securityConfig: SecurityConfig = {
  session: {
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
    inactivityTimeout: 30 * 60 * 1000, // 30 minutes
    maxConcurrentSessions: 1,
    requireMFAForSensitiveOperations: true,
  },
  rateLimit: {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    ipBlockThreshold: 100,
    ipBlockDuration: 24 * 60 * 60 * 1000, // 24 hours
  },
  password: {
    minLength: 12,
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
    preventReuse: 5, // last 5 passwords
    requireComplexity: true,
  },
  mfa: {
    enabled: true,
    methods: ['sms', 'email', 'authenticatorApp'],
    requireMFAForSensitiveOperations: true,
  },
} as const;

// Re-export from index.ts
export default securityConfig;
