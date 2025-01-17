/**
 * Type definitions for environment variables
 * These types ensure type safety when accessing process.env
 */
declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        // Next.js environment
        NEXT_PUBLIC_NODE_ENV: 'development' | 'production';

        // Firebase Client Configuration
        NEXT_PUBLIC_FIREBASE_API_KEY: string;
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
        NEXT_PUBLIC_FIREBASE_APP_ID: string;

        // Firebase Admin Configuration
        FIREBASE_ADMIN_PROJECT_ID: string;
        FIREBASE_ADMIN_CLIENT_EMAIL: string;
        FIREBASE_ADMIN_PRIVATE_KEY: string;
      }
    }
  }
}
