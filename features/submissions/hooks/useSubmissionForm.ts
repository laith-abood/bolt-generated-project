import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { useFieldArray, useForm } from 'react-hook-form';

import { useAuth } from '@/features/auth';
import { ErrorHandler } from '@/lib/errors/ErrorHandler';
import { rateLimit } from '@/lib/utils/rateLimit';

import { SubmissionService } from '../services/SubmissionService';
import type { SubmissionFormData } from '../types';
import { submissionFormSchema } from '../types';

export const useSubmissionForm = () => {
  const { user } = useAuth();
  const submissionService = new SubmissionService();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues: {
      totalCalls: 0,
      sales: [],
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sales',
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!user) {
      setError('root', {
        type: 'manual',
        message: 'You must be logged in to submit data',
      });
      return;
    }

    try {
      // Check rate limit
      const isAllowed = await rateLimit.check(
        `submission:${user.id}`,
        10, // max 10 submissions
        '15m' // per 15 minutes
      );

      if (!isAllowed) {
        setError('root', {
          type: 'manual',
          message: 'Too many submissions. Please try again later.',
        });
        return;
      }

      // Sanitize notes
      const sanitizedNotes = data.notes
        ? DOMPurify.sanitize(data.notes)
        : undefined;

      // Generate IDs for sales
      const salesWithIds = data.sales.map((sale) => ({
        ...sale,
        id: crypto.randomUUID(),
      }));

      await submissionService.createSubmission({
        agentId: user.id,
        agencyId: user.agencyId,
        date: new Date(),
        totalCalls: data.totalCalls,
        sales: salesWithIds,
        notes: sanitizedNotes,
      });

      reset();
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to submit data');
      setError('root', {
        type: 'manual',
        message: error.message,
      });

      void ErrorHandler.handleError(error, {
        action: 'SubmissionForm.onSubmit',
        userId: user.id,
      });
    }
  });

  const handleAddSale = () => {
    append({
      planType: 'A',
      effectiveDate: new Date(),
      notes: '',
      status: 'pending',
    });
  };

  return {
    register,
    fields,
    errors,
    isSubmitting,
    onSubmit,
    handleAddSale,
    remove,
  };
};
