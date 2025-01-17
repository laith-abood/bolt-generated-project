import { FirebaseError, getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { firebaseConfig } from './config';
import { FirebaseErrorHandler } from './errors';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services (only on client side)
export const auth = typeof window !== 'undefined' ? getAuth(app) : null;
export const db = typeof window !== 'undefined' ? getFirestore(app) : null;

// Re-export error handler for convenience
export const handleFirebaseError = (error: unknown): string => {
  const firebaseError = error as FirebaseError;
  if (firebaseError?.code) {
    if (firebaseError.code.startsWith('auth/')) {
      const authError = FirebaseErrorHandler.handleAuthError(firebaseError);
      return authError.message;
    }
    if (firebaseError.code.startsWith('firestore/')) {
      const firestoreError =
        FirebaseErrorHandler.handleFirestoreError(firebaseError);
      return firestoreError.message;
    }
  }
  return 'An unexpected error occurred';
};

export default app;
