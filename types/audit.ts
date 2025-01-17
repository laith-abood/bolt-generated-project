export enum AuditActions {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  LOGOUT = 'logout',
  REPORT_GENERATED = 'report_generated',
  SUBMIT_CALLS = 'submit_calls',
  AGENT_RETRIEVED = 'agent_retrieved',
  AGENT_UPDATED = 'agent_updated',
  ACCESS_DENIED = 'access_denied',
  ROUTE_ACCESSED = 'route_accessed',
}

export type AuditAction = AuditActions;

export interface AuditLogEntry {
  action: AuditAction;
  timestamp: Date;
  userId?: string;
  metadata?: Record<string, unknown>;
}
