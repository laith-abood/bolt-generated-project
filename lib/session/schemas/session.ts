import { z } from 'zod';

export const sessionSchema = z.object({
  id: z.string().min(1, 'Session ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  deviceFingerprint: z.string().min(1, 'Device fingerprint is required'),
  createdAt: z.date(),
  expiresAt: z.date(),
  lastActivity: z.date(),
});

export type Session = z.infer<typeof sessionSchema>;

// Re-export from index.ts to maintain a clean public API
export default sessionSchema;
