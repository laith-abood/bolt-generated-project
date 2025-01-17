import { z } from 'zod';

import { saleBaseSchema, submissionSchema } from '../schemas/submission';
import type { SaleBase, Submission } from '../schemas/submission';

export type SubmissionFormData = {
  totalCalls: number;
  sales: SaleBase[];
  notes?: string;
};

export const submissionFormSchema = z.object({
  totalCalls: submissionSchema.shape.totalCalls,
  sales: z.array(saleBaseSchema),
  notes: submissionSchema.shape.notes,
});

export type { Submission };
