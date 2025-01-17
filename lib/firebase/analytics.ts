import { Analytics, getAnalytics, isSupported } from 'firebase/analytics';
import { firebase } from './initialize';

let analytics: Analytics | null = null;

export async function initializeAnalytics(): Promise<void> {
  try {
    if (await isSupported()) {
      analytics = getAnalytics(firebase.getApp());
    }
  } catch (error) {
    console.error('Analytics initialization failed:', error);
  }
}

export function getFirebaseAnalytics(): Analytics | null {
  return analytics;
}
