import {
  type CollectionReference,
  type DocumentData,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { ErrorLogger } from '@/lib/errors/logger';
import { db } from '@/lib/firebase';

import {
  type Agency,
  type AgencyBase,
  type AgencySettings,
  agencyBaseSchema,
  agencySchema,
} from '../schemas/agency';

export class AgencyService {
  private static readonly COLLECTION = 'agencies';

  async createAgency(
    name: string,
    ownerId: string,
    settings: AgencySettings
  ): Promise<string> {
    if (!db) throw new Error('Firestore not initialized');

    try {
      const agency: AgencyBase = {
        name,
        ownerId,
        settings,
        createdAt: new Date(),
      };

      const validatedData = agencyBaseSchema.parse(agency);
      const agenciesRef = collection(
        db,
        AgencyService.COLLECTION
      ) as CollectionReference<DocumentData>;
      const docRef = doc(agenciesRef);

      await setDoc(docRef, {
        ...validatedData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      void ErrorLogger.logError(
        error instanceof Error ? error : new Error('Agency creation failed'),
        {
          action: 'AgencyService.createAgency',
          metadata: { name, ownerId },
        }
      );
      throw error;
    }
  }

  async getAgency(id: string): Promise<Agency> {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = doc(
        collection(
          db,
          AgencyService.COLLECTION
        ) as CollectionReference<DocumentData>,
        id
      );
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Agency not found');
      }

      return agencySchema.parse({
        id: docSnap.id,
        ...docSnap.data(),
      });
    } catch (error) {
      void ErrorLogger.logError(
        error instanceof Error ? error : new Error('Failed to fetch agency'),
        {
          action: 'AgencyService.getAgency',
          metadata: { id },
        }
      );

      throw error;
    }
  }

  async updateAgencySettings(
    id: string,
    settings: Partial<AgencySettings>
  ): Promise<void> {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = doc(
        collection(
          db,
          AgencyService.COLLECTION
        ) as CollectionReference<DocumentData>,
        id
      );
      await updateDoc(docRef, {
        settings: settings,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      void ErrorLogger.logError(
        error instanceof Error
          ? error
          : new Error('Agency settings update failed'),
        {
          action: 'AgencyService.updateAgencySettings',
          metadata: { id, settings },
        }
      );

      throw error;
    }
  }

  async updateAgencyName(id: string, name: string): Promise<void> {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = doc(
        collection(
          db,
          AgencyService.COLLECTION
        ) as CollectionReference<DocumentData>,
        id
      );
      await updateDoc(docRef, {
        name,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      void ErrorLogger.logError(
        error instanceof Error ? error : new Error('Agency name update failed'),
        {
          action: 'AgencyService.updateAgencyName',
          metadata: { id, name },
        }
      );

      throw error;
    }
  }
}

// Export a singleton instance
export const agencyService = new AgencyService();
