import { z } from 'zod';

import type { FirebaseConfig } from './types';

const firebaseConfigSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  authDomain: z.string().min(1, 'Auth Domain is required'),
  projectId: z.string().min(1, 'Project ID is required'),
  storageBucket: z.string().min(1, 'Storage Bucket is required'),
  messagingSenderId: z.string().min(1, 'Messaging Sender ID is required'),
  appId: z.string().min(1, 'App ID is required'),
  measurementId: z.string().optional(),
});

export const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyDQdEka09c_N0fA-J8sRu6951EyIrIWU9s",
  authDomain: "mrbobheap.firebaseapp.com",
  projectId: "mrbobheap",
  storageBucket: "mrbobheap.firebasestorage.app",
  messagingSenderId: "231341770899",
  appId: "1:231341770899:web:cb9129eb87cab9dcffe566",
  measurementId: "G-NV8Y2X2SXT"
};

// Validate the config
firebaseConfigSchema.parse(firebaseConfig);
