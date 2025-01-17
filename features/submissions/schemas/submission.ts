import { z } from 'zod';

const PLAN_TYPES = ['A', 'B', 'C', 'D', 'F', 'G', 'K', 'L', 'M', 'N'] as const;
const SALE_STATUSES = ['pending', 'approved', 'rejected'] as const;

export const saleBaseSchema = z.object({
  planType: z.enum(PLAN_TYPES),
  effectiveDate: z.date(),
  notes: z
    .string()
    .min(1, 'Notes are required')
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional(),
  status: z.enum(SALE_STATUSES).default('pending'),
  reviewedBy: z.string().optional(),
  reviewedAt: z.date().optional(),
});

export const saleSchema = saleBaseSchema.extend({
  id: z.string().min(1),
});

export const submissionBaseSchema = z.object({
  agentId: z.string().min(1, 'Agent ID is required'),
  agencyId: z.string().min(1, 'Agency ID is required'),
  date: z.date(),
  totalCalls: z
    .number()
    .min(0, 'Total calls cannot be negative')
    .max(1000, 'Total calls cannot exceed 1000'),
  sales: z.array(saleSchema).max(100, 'Cannot exceed 100 sales per submission'),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type PlanType = (typeof PLAN_TYPES)[number];
export type SaleStatus = (typeof SALE_STATUSES)[number];
export type Sale = z.infer<typeof saleSchema>;
export type SaleBase = z.infer<typeof saleBaseSchema>;

export const submissionSchema = submissionBaseSchema.extend({
  id: z.string().min(1),
});

export type Submission = z.infer<typeof submissionSchema>;
export type SubmissionBase = z.infer<typeof submissionBaseSchema>;
export type SubmissionUpdate = Partial<SubmissionBase>;

export const submissionUpdateSchema = submissionBaseSchema.partial();
