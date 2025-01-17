import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['owner', 'agent'] as const).default('agent'),
  agencyId: z.string().min(1, 'Agency ID is required'),
  disabled: z.boolean().optional(),
  lastLogin: z.date().optional(),
});

export type UserSchemaType = z.infer<typeof userSchema>;
