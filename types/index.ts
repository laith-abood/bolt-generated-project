import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'owner' | 'agent';

export type Permission =
  | 'view_dashboard'
  | 'submit_calls'
  | 'view_reports'
  | 'manage_agents'
  | 'view_agents'
  | 'edit_profile';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  agencyId: string;
  createdAt: Date;
  lastLogin?: Date;
  disabled?: boolean;
}

export interface Agency {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt?: Date;
  settings: AgencySettings;
}

export interface AgencySettings {
  allowAgentEdit: boolean;
  editTimeWindow: number;
  requireNotes: boolean;
}

export type Carrier =
  | 'Aetna'
  | 'Humana'
  | 'UnitedHealthcare'
  | 'Cigna'
  | 'Other';

export type ProductType =
  | 'Medicare Advantage'
  | 'Medicare Supplement'
  | 'Prescription Drug Plan';

export interface Sale {
  carrier: Carrier;
  productType: ProductType;
  count: number;
}

export interface Submission {
  id: string;
  agentId: string;
  agencyId: string;
  date: Timestamp;
  totalCalls: number;
  sales: Sale[];
  note?: string;
  edited: boolean;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshSession: () => Promise<void>;
}

export interface SalesMetrics {
  totalSales: number;
  salesByCarrier: Record<Carrier, number>;
  salesByProduct: Record<ProductType, number>;
  conversionRate: number;
}

export interface AgentMetrics extends SalesMetrics {
  totalCalls: number;
  averageSalesPerDay: number;
  topProducts: Array<{ type: ProductType; count: number }>;
  topCarriers: Array<{ carrier: Carrier; count: number }>;
}

export interface AgencyMetrics extends SalesMetrics {
  totalAgents: number;
  activeAgents: number;
  totalSubmissions: number;
  averageSalesPerAgent: number;
  topPerformingAgents: Array<{ agentId: string; sales: number }>;
}
