import {
  type DocumentData,
  type DocumentReference,
  type FirestoreDataConverter,
  type Query as FirestoreQuery,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
  type SnapshotOptions,
  type Transaction,
  type UpdateData,
  type WithFieldValue,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

import { FirebaseErrorHandler } from './errors';
import { firebase } from './initialize';
import type {
  QueryOptions,
  QueryResult,
  RetryOptions,
  WriteOperation,
} from './types';

interface CacheEntry<T> {
  data: T[];
  snapshot: QuerySnapshot<T>;
  timestamp: number;
}

type DocumentModel = DocumentData & { id?: string };

export class FirestoreService {
  private static instance: FirestoreService;
  private queryCache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly DEFAULT_RETRY_OPTIONS: RetryOptions = {
    maxAttempts: 3,
    backoff: {
      initial: 1000,
      factor: 2,
      maxDelay: 30000,
    },
  };

  private constructor() {}

  public static getInstance(): FirestoreService {
    if (!FirestoreService.instance) {
      FirestoreService.instance = new FirestoreService();
    }
    return FirestoreService.instance;
  }

  private get db() {
    return firebase.getDb();
  }

  // Create a typed converter
  private createConverter<
    T extends DocumentModel,
  >(): FirestoreDataConverter<T> {
    return {
      toFirestore(modelObject: WithFieldValue<T>): DocumentData {
        const { _id, ...data } = modelObject as any;
        return data;
      },
      fromFirestore(
        snapshot: QueryDocumentSnapshot<DocumentData>,
        options: SnapshotOptions
      ): T {
        const data = snapshot.data(options);
        return {
          ...data,
          id: snapshot.id,
        } as T;
      },
    };
  }

  // Get a typed document reference
  private getTypedDoc<T extends DocumentModel>(
    path: string
  ): DocumentReference<T> {
    return doc(this.db, path).withConverter(this.createConverter<T>());
  }

  // Query execution with caching
  public async executeQuery<T extends DocumentModel>(
    query: FirestoreQuery<T>,
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    const queryString = JSON.stringify(query);
    const cachedResult = this.queryCache.get(queryString);
    const cacheDuration = options.cacheDuration ?? this.DEFAULT_CACHE_DURATION;

    // Return cached result if valid
    if (cachedResult && Date.now() - cachedResult.timestamp < cacheDuration) {
      return {
        data: cachedResult.data,
        snapshot: cachedResult.snapshot,
        fromCache: true,
      };
    }

    try {
      const snapshot = await FirebaseErrorHandler.withRetry(
        () => getDocs(query),
        options.retries ?? this.DEFAULT_RETRY_OPTIONS.maxAttempts
      );

      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const result = {
        data,
        snapshot,
        fromCache: false,
      };

      // Cache the result
      this.queryCache.set(queryString, {
        data,
        snapshot,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      throw FirebaseErrorHandler.handleFirestoreError(error as any);
    }
  }

  // Batch operations
  public async executeBatch(operations: WriteOperation[]): Promise<void> {
    const batch = writeBatch(this.db);

    try {
      for (const operation of operations) {
        const docRef = doc(this.db, operation.path);

        switch (operation.type) {
          case 'set':
            batch.set(docRef, operation.data as DocumentData);
            break;
          case 'update':
            batch.update(docRef, operation.data as DocumentData);
            break;
          case 'delete':
            batch.delete(docRef);
            break;
        }
      }

      await FirebaseErrorHandler.withRetry(() => batch.commit());
    } catch (error) {
      throw FirebaseErrorHandler.handleFirestoreError(error as any);
    }
  }

  // Transaction with retry
  public async executeTransaction<T>(
    updateFunction: (transaction: Transaction) => Promise<T>,
    maxAttempts: number = this.DEFAULT_RETRY_OPTIONS.maxAttempts
  ): Promise<T> {
    try {
      return await FirebaseErrorHandler.withRetry(
        () => runTransaction(this.db, updateFunction),
        maxAttempts
      );
    } catch (error) {
      throw FirebaseErrorHandler.handleFirestoreError(error as any);
    }
  }

  // Cache management
  public clearCache(): void {
    this.queryCache.clear();
  }

  public clearCacheForQuery(query: FirestoreQuery<any>): void {
    const queryString = JSON.stringify(query);
    this.queryCache.delete(queryString);
  }

  // Helper methods for common operations
  public async getDocument<T extends DocumentModel>(
    path: string
  ): Promise<T | null> {
    try {
      const docRef = this.getTypedDoc<T>(path);
      const docSnap = await FirebaseErrorHandler.withRetry(() =>
        getDoc(docRef)
      );

      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      throw FirebaseErrorHandler.handleFirestoreError(error as any);
    }
  }

  public async setDocument<T extends DocumentModel>(
    path: string,
    data: WithFieldValue<T>,
    merge: boolean = false
  ): Promise<void> {
    try {
      const docRef = this.getTypedDoc<T>(path);
      const { _id, ...docData } = data as any;
      await FirebaseErrorHandler.withRetry(() =>
        setDoc(docRef, docData, { merge })
      );
    } catch (error) {
      throw FirebaseErrorHandler.handleFirestoreError(error as any);
    }
  }

  public async updateDocument<T extends DocumentModel>(
    path: string,
    data: Partial<T>
  ): Promise<void> {
    try {
      const docRef = this.getTypedDoc<T>(path);
      const { _id, ...updateData } = data as any;
      await FirebaseErrorHandler.withRetry(() =>
        updateDoc(docRef, updateData as UpdateData<T>)
      );
    } catch (error) {
      throw FirebaseErrorHandler.handleFirestoreError(error as any);
    }
  }

  public async deleteDocument(path: string): Promise<void> {
    try {
      const docRef = doc(this.db, path);
      await FirebaseErrorHandler.withRetry(() => deleteDoc(docRef));
    } catch (error) {
      throw FirebaseErrorHandler.handleFirestoreError(error as any);
    }
  }
}

// Export singleton instance
export const firestoreService = FirestoreService.getInstance();
