/**
 * Type-safe environment configuration
 */

type EnvVar = keyof typeof process.env;

const getEnvVar = (key: EnvVar): string => {
  // Next.js makes process.env available at build time
  const value = process.env[key];
  if (typeof value !== 'string') {
    throw new Error(`Missing required environment variable: ${String(key)}`);
  }
  return value;
};

const env = {
  isDevelopment: getEnvVar('NEXT_PUBLIC_NODE_ENV') === 'development',
  isProduction: getEnvVar('NEXT_PUBLIC_NODE_ENV') === 'production',
  firebase: {
    apiKey: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY'),
    authDomain: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
    storageBucket: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID'),
    measurementId: getEnvVar('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'),
  },
  firebaseAdmin: {
    projectId: getEnvVar('FIREBASE_ADMIN_PROJECT_ID'),
    clientEmail: getEnvVar('FIREBASE_ADMIN_CLIENT_EMAIL'),
    privateKey: getEnvVar('FIREBASE_ADMIN_PRIVATE_KEY'),
  },
} as const;

// Type-safe environment configuration
export type Env = typeof env;

// Required environment variables
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_NODE_ENV',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
  'FIREBASE_ADMIN_PROJECT_ID',
  'FIREBASE_ADMIN_CLIENT_EMAIL',
  'FIREBASE_ADMIN_PRIVATE_KEY',
] as const;

// Validate environment variables
function validateEnv(): void {
  try {
    REQUIRED_ENV_VARS.forEach((key) => getEnvVar(key));
  } catch (error) {
    // Use Next.js logger in development
    if (env.isDevelopment && error instanceof Error) {
      // Use Next.js logger

      console.error('Environment validation failed:', error.message);
    }
    throw error;
  }
}

// Only validate in development
if (env.isDevelopment) {
  validateEnv();
}

export default env;
