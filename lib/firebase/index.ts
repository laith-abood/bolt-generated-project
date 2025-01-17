export { firebase } from './initialize';
export { firebaseConfig } from './config';
export type { FirebaseConfig } from './types';

import { firebase } from './initialize';

// Re-export commonly used Firebase services
export const app = firebase.getApp();
export const auth = firebase.getAuth();
export const db = firebase.getDb();
export const analytics = firebase.getAnalytics();
