import type { Analytics } from 'firebase/analytics';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type {
  DocumentData,
  Firestore,
  QuerySnapshot,
} from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  analytics?: Analytics;
}

export interface WriteOperation<T = DocumentData> {
  type: 'set' | 'update' | 'delete';
  path: string;
  data?: T;
}

export interface QueryOptions {
  cacheDuration?: number;
  retries?: number;
  timeout?: number;
}

export interface FirebaseError extends Error {
  code: string;
  customData?: Record<string, unknown>;
}

export type QueryResult<T> = {
  data: T[];
  snapshot: QuerySnapshot<T>;
  fromCache: boolean;
};

export interface RetryOptions {
  maxAttempts: number;
  backoff: {
    initial: number;
    factor: number;
    maxDelay: number;
  };
}
