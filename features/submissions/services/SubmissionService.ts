import {
  type CollectionReference,
  type DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { ErrorLogger } from '@/lib/errors/logger';
import { db } from '@/lib/firebase';

import {
  type Submission,
  type SubmissionBase,
  submissionBaseSchema,
  submissionSchema,
} from '../schemas/submission';

export class SubmissionService {
  private static readonly COLLECTION = 'submissions';

  async createSubmission(
    data: Omit<SubmissionBase, 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    if (!db) throw new Error('Firestore not initialized');

    try {
      // Validate data before submission
      const validatedData = submissionBaseSchema
        .omit({
          createdAt: true,
          updatedAt: true,
        } as const)
        .parse(data);

      const submissionsRef = collection(
        db,
        SubmissionService.COLLECTION
      ) as CollectionReference<DocumentData>;
      const docRef = await addDoc(submissionsRef, {
        ...validatedData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      void ErrorLogger.logError(
        error instanceof Error
          ? error
          : new Error('Submission creation failed'),
        {
          action: 'SubmissionService.createSubmission',
          metadata: { data },
        }
      );
      throw error;
    }
  }

  async getSubmissionsByAgent(agentId: string): Promise<Submission[]> {
    if (!db) throw new Error('Firestore not initialized');

    try {
      const submissionsRef = collection(
        db,
        SubmissionService.COLLECTION
      ) as CollectionReference<DocumentData>;
      const q = query(submissionsRef, where('agentId', '==', agentId));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) =>
        submissionSchema.parse({
          id: doc.id,
          ...doc.data(),
        })
      );
    } catch (error) {
      void ErrorLogger.logError(
        error instanceof Error
          ? error
          : new Error('Failed to fetch submissions'),
        {
          action: 'SubmissionService.getSubmissionsByAgent',
          metadata: { agentId },
        }
      );
      throw error;
    }
  }

  async updateSubmission(
    id: string,
    data: Partial<Omit<SubmissionBase, 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');

    try {
      const submissionsRef = collection(
        db,
        SubmissionService.COLLECTION
      ) as CollectionReference<DocumentData>;
      const docRef = doc(submissionsRef, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      void ErrorLogger.logError(
        error instanceof Error ? error : new Error('Submission update failed'),
        {
          action: 'SubmissionService.updateSubmission',
          metadata: { id, data },
        }
      );
      throw error;
    }
  }

  async deleteSubmission(id: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');

    try {
      const submissionsRef = collection(
        db,
        SubmissionService.COLLECTION
      ) as CollectionReference<DocumentData>;
      const docRef = doc(submissionsRef, id);
      await deleteDoc(docRef);
    } catch (error) {
      void ErrorLogger.logError(
        error instanceof Error
          ? error
          : new Error('Submission deletion failed'),
        {
          action: 'SubmissionService.deleteSubmission',
          metadata: { id },
        }
      );
      throw error;
    }
  }
}

// Export a singleton instance
export const submissionService = new SubmissionService();
