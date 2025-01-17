import {
  type CollectionReference,
  type DocumentData,
  type QueryDocumentSnapshot,
  Timestamp,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { z } from 'zod';

import { useCallback, useState } from 'react';

import { ErrorLogger } from '@/lib/errors/logger';
import { db } from '@/lib/firebase';
import { auditLog } from '@/lib/utils/audit';
import { AuditActions } from '@/types/audit';

import { type Submission, submissionSchema } from '../schemas/submission';

interface FetchOptions {
  agencyId: string;
  agentId?: string;
  startDate?: Date;
  endDate?: Date;
}

const firestoreSubmissionSchema = submissionSchema.extend({
  date: z.instanceof(Timestamp),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp).optional(),
});

type FirestoreSubmission = z.infer<typeof firestoreSubmissionSchema>;

interface UseSubmissionsResult {
  submissions: Submission[];
  loading: boolean;
  error: Error | null;
  fetchSubmissions: (options: FetchOptions) => Promise<Submission[]>;
  refreshSubmissions: () => Promise<void>;
}

function convertFirestoreSubmission(
  doc: QueryDocumentSnapshot<DocumentData>
): Submission | null {
  try {
    const data = doc.data() as FirestoreSubmission;
    const validationResult = firestoreSubmissionSchema.safeParse(data);

    if (!validationResult.success) {
      void ErrorLogger.logError(new Error('Invalid submission data'), {
        context: 'convertFirestoreSubmission',
        submissionId: doc.id,
        validationErrors: validationResult.error.errors,
      });
      return null;
    }

    return {
      id: doc.id,
      agencyId: data.agencyId,
      agentId: data.agentId,
      date: data.date.toDate(),
      totalCalls: data.totalCalls,
      sales: data.sales,
      notes: data.notes,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  } catch (error) {
    void ErrorLogger.logError(
      error instanceof Error
        ? error
        : new Error('Failed to convert submission'),
      {
        context: 'convertFirestoreSubmission',
        submissionId: doc.id,
      }
    );
    return null;
  }
}

export function useSubmissions(): UseSubmissionsResult {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchOptions, setLastFetchOptions] = useState<FetchOptions | null>(
    null
  );

  const fetchSubmissions = useCallback(
    async (options: FetchOptions): Promise<Submission[]> => {
      if (!db) throw new Error('Firestore not initialized');

      try {
        setLoading(true);
        setError(null);
        setLastFetchOptions(options);

        const constraints = [
          where('agencyId', '==', options.agencyId),
          orderBy('date', 'desc'),
        ];

        if (options.agentId) {
          constraints.push(where('agentId', '==', options.agentId));
        }

        if (options.startDate) {
          constraints.push(
            where('date', '>=', Timestamp.fromDate(options.startDate))
          );
        }

        if (options.endDate) {
          constraints.push(
            where('date', '<=', Timestamp.fromDate(options.endDate))
          );
        }

        const submissionsRef = collection(
          db,
          'submissions'
        ) as CollectionReference<DocumentData>;
        const q = query(submissionsRef, ...constraints);

        const querySnapshot = await getDocs(q);
        const fetchedSubmissions = querySnapshot.docs
          .map(convertFirestoreSubmission)
          .filter(
            (submission): submission is Submission => submission !== null
          );

        setSubmissions(fetchedSubmissions);
        setError(null);

        void auditLog(AuditActions.REPORT_GENERATED, {
          count: fetchedSubmissions.length,
          agencyId: options.agencyId,
          agentId: options.agentId,
        });

        return fetchedSubmissions;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to fetch submissions');
        setError(error);
        void ErrorLogger.logError(error, {
          context: 'useSubmissions.fetchSubmissions',
          options,
        });
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const refreshSubmissions = useCallback(async (): Promise<void> => {
    if (lastFetchOptions) {
      await fetchSubmissions(lastFetchOptions);
    }
  }, [fetchSubmissions, lastFetchOptions]);

  return {
    submissions,
    loading,
    error,
    fetchSubmissions,
    refreshSubmissions,
  };
}
