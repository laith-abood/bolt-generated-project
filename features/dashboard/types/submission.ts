import { DocumentData, Timestamp } from 'firebase/firestore';

// Base document model type that matches Firestore's expectations
export interface DocumentModel extends DocumentData {
  id?: string;
}

export interface Sale {
  carrier: string;
  productType: string;
  count: number;
}

export interface SubmissionData {
  agentId: string;
  agencyId: string;
  date: Timestamp;
  totalCalls: number;
  sales: Sale[];
  note?: string;
  edited: boolean;
  lastEditDate?: Timestamp;
}

export interface Submission extends SubmissionData, DocumentModel {
  id: string;
}
