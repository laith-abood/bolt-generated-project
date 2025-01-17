import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().optional().default('/api'),
  FIREBASE_API_KEY: z.string(),
  FIREBASE_AUTH_DOMAIN: z.string(),
  FIREBASE_PROJECT_ID: z.string(),
});

export const environment = (() => {
  try {
    const parsed = environmentSchema.parse(process.env);
    return {
      isDevelopment: parsed.NODE_ENV === 'development',
      isProduction: parsed.NODE_ENV === 'production',
      isTest: parsed.NODE_ENV === 'test',
      apiBaseUrl: parsed.NEXT_PUBLIC_API_BASE_URL,
      firebase: {
        apiKey: parsed.FIREBASE_API_KEY,
        authDomain: parsed.FIREBASE_AUTH_DOMAIN,
        projectId: parsed.FIREBASE_PROJECT_ID,
      },
    };
  } catch (error) {
    console.error('Environment configuration error:', error);
    throw new Error('Invalid environment configuration');
  }
})();
