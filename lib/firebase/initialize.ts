import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { firebaseConfig } from './config';

class FirebaseClient {
  private static instance: FirebaseClient;
  private app: ReturnType<typeof initializeApp>;
  private analytics: ReturnType<typeof getAnalytics> | undefined;
  private auth: ReturnType<typeof getAuth>;
  private db: ReturnType<typeof getFirestore>;

  private constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
    
    // Initialize analytics only in browser environment
    if (typeof window !== 'undefined') {
      this.initializeAnalytics();
    }
  }

  private async initializeAnalytics() {
    const analyticsSupported = await isSupported();
    if (analyticsSupported) {
      this.analytics = getAnalytics(this.app);
    }
  }

  public static getInstance(): FirebaseClient {
    if (!FirebaseClient.instance) {
      FirebaseClient.instance = new FirebaseClient();
    }
    return FirebaseClient.instance;
  }

  public getApp() {
    return this.app;
  }

  public getAuth() {
    return this.auth;
  }

  public getDb() {
    return this.db;
  }

  public getAnalytics() {
    return this.analytics;
  }
}

export const firebase = FirebaseClient.getInstance();
