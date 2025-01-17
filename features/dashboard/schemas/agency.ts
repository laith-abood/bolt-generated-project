import { z } from 'zod';

export const agencySettingsSchema = z.object({
  allowAgentEdit: z.boolean(),
  editTimeWindow: z
    .number()
    .min(1, 'Edit time window must be at least 1 hour')
    .max(72, 'Edit time window cannot exceed 72 hours'),
  requireNotes: z.boolean(),
});

export const agencyBaseSchema = z.object({
  name: z
    .string()
    .min(2, 'Agency name must be at least 2 characters')
    .max(100, 'Agency name must be at most 100 characters')
    .regex(
      /^[a-zA-Z0-9\s-'&]+$/,
      'Agency name can only contain letters, numbers, spaces, hyphens, apostrophes, and ampersands'
    ),
  ownerId: z.string().min(1, 'Owner ID is required'),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  settings: agencySettingsSchema,
});

export type AgencySettings = z.infer<typeof agencySettingsSchema>;
export const agencySchema = agencyBaseSchema.extend({
  id: z.string().min(1),
});

export type Agency = z.infer<typeof agencySchema>;
export type AgencyBase = z.infer<typeof agencyBaseSchema>;
export type AgencyUpdate = Partial<AgencyBase>;

export const agencyUpdateSchema = agencyBaseSchema.partial();
