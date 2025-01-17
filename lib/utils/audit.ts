import { getFirestore } from 'firebase-admin/firestore';

import { ErrorLogger } from '@/lib/errors/logger';
import { AuditActions } from '@/types/audit';

async function sendToMonitoring(entry: Record<string, unknown>): Promise<void> {
  const monitoringEndpoint = process.env.MONITORING_ENDPOINT;
  if (!monitoringEndpoint) return;

  await fetch(monitoringEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
}

export async function auditLog(
  action: AuditActions,
  data: Record<string, unknown>
): Promise<void> {
  const entry = {
    action,
    data,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  };

  try {
    const db = getFirestore();
    await db.collection('audit_logs').add(entry);

    // Also log to monitoring service if configured
    if (process.env.MONITORING_ENABLED === 'true') {
      await sendToMonitoring(entry);
    }
  } catch (error) {
    void ErrorLogger.logError(error as Error, {
      action: 'audit_log_failed',
      context: entry,
    });
  }
}

export type { AuditActions };
