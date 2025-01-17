import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(['admin', 'agent', 'owner']),
  agencyId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Agency schema
export const agencySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  ownerId: z.string(),
  settings: z
    .object({
      timezone: z.string().default('America/New_York'),
      currency: z.string().default('USD'),
    })
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Agency settings schema
export const agencySettingsSchema = z.object({
  timezone: z.string(),
  currency: z.string(),
});

// Sale schema
export const saleSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  agencyId: z.string(),
  amount: z.number().min(0),
  date: z.date(),
  type: z.enum(['medicare', 'life', 'other']),
  status: z.enum(['pending', 'completed', 'cancelled']),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Submission schema
export const submissionSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  agencyId: z.string(),
  clientName: z.string().min(1),
  clientPhone: z.string().min(10),
  clientEmail: z.string().email().optional(),
  type: z.enum(['medicare', 'life', 'other']),
  status: z.enum(['pending', 'approved', 'rejected']),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Session schema
export const sessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  expires: z.date(),
  createdAt: z.date(),
});

// Login form schema
export const loginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Registration form schema
export const registrationFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    agencyName: z.string().min(1, 'Agency name is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Add agent form schema
export const addAgentFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['agent'], {
    required_error: 'Role must be agent',
  }),
});
