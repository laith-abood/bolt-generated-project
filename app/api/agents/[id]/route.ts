import { NextResponse } from 'next/server';

import { ErrorHandler } from 'lib/errors/ErrorHandler';
import { initializeAdmin } from 'lib/firebase/admin';
import { getSessionManager } from 'lib/session/SessionManager';
import { auditLog } from 'lib/utils/audit';
import { userSchema } from 'lib/validation/schemas/user';
import type { Permission } from 'types';
import { AuditActions } from 'types/audit';

interface AgentResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  agencyId: string;
  createdAt: string;
  updatedAt: string;
}

interface AgentData {
  name: string;
  email: string;
  role: 'owner' | 'agent';
  agencyId: string;
  disabled?: boolean;
  lastLogin?: Date;
}

class AgentController {
  private static async getFirebaseAdmin() {
    return await initializeAdmin();
  }

  private static async validatePermissions(
    permission: Permission
  ): Promise<void> {
    const sessionManager = getSessionManager();
    if (!sessionManager.hasPermission(permission)) {
      throw new Error('Unauthorized');
    }
  }

  private static async getAgentDocument(id: string) {
    const { db } = await this.getFirebaseAdmin();
    const agentRef = db.collection('users').doc(id);
    const agentSnap = await agentRef.get();

    if (!agentSnap.exists) {
      throw new Error('Agent not found');
    }

    return { ref: agentRef, data: agentSnap.data()! };
  }

  private static validateAgentData(data: Partial<AgentData>): void {
    const result = userSchema.partial().safeParse(data);
    if (!result.success) {
      throw new Error(result.error.errors[0].message);
    }
  }

  private static async validateAgencyAccess(
    agentData: FirebaseFirestore.DocumentData
  ): Promise<void> {
    const currentUser = getSessionManager().getCurrentUser();
    if (!currentUser) {
      throw new Error('Unauthorized');
    }

    if (
      agentData.role === 'owner' ||
      agentData.agencyId !== currentUser.agencyId
    ) {
      throw new Error('Unauthorized to access this agent');
    }
  }

  static async getAgent(id: string): Promise<AgentResponse> {
    await this.validatePermissions('manage_agents');
    const { data } = await this.getAgentDocument(id);

    const response: AgentResponse = {
      id,
      name: data.name,
      email: data.email,
      role: data.role,
      agencyId: data.agencyId,
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt.toDate().toISOString(),
    };

    void auditLog('agent_retrieved' as AuditActions, {
      agentId: id,
      userId: getSessionManager().getCurrentUser()?.id,
    });

    return response;
  }

  static async updateAgent(
    id: string,
    data: Partial<AgentData>
  ): Promise<AgentResponse> {
    await this.validatePermissions('manage_agents');
    this.validateAgentData(data);

    const { ref, data: currentAgent } = await this.getAgentDocument(id);

    // Check restricted fields
    const restrictedFields = ['role', 'agencyId'] as const;
    const hasRestrictedChanges = restrictedFields.some(
      (field) =>
        data[field as keyof AgentData] !== undefined &&
        data[field as keyof AgentData] !== currentAgent[field]
    );

    if (hasRestrictedChanges) {
      await this.validatePermissions('manage_agents');
    }

    const updatedFields = Object.entries(data).reduce(
      (acc, [key, value]) => {
        if (value !== currentAgent[key]) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, unknown>
    );

    if (Object.keys(updatedFields).length === 0) {
      throw new Error('No changes detected');
    }

    await ref.update({
      ...updatedFields,
      updatedAt: new Date(),
    });

    const response: AgentResponse = {
      id,
      name: data.name || currentAgent.name,
      email: data.email || currentAgent.email,
      role: data.role || currentAgent.role,
      agencyId: currentAgent.agencyId,
      createdAt: currentAgent.createdAt.toDate().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    void auditLog('agent_updated' as AuditActions, {
      agentId: id,
      userId: getSessionManager().getCurrentUser()?.id,
      changes: updatedFields,
    });

    return response;
  }

  static async deleteAgent(id: string): Promise<void> {
    await this.validatePermissions('manage_agents');
    const { data } = await this.getAgentDocument(id);
    await this.validateAgencyAccess(data);

    const currentUser = getSessionManager().getCurrentUser();
    if (!currentUser) {
      throw new Error('Unauthorized');
    }

    const deleteContext: Record<string, unknown> = {
      agentId: id,
      requesterId: currentUser.id,
      agencyId: currentUser.agencyId,
    };

    const { auth } = await this.getFirebaseAdmin();
    await auth.deleteUser(id);

    void auditLog('agent_deleted' as AuditActions, {
      agentId: id,
      userId: currentUser.id,
      context: deleteContext,
    });
  }
}

export async function GET(
  _request: Request,
  context: { params: { id: string } }
): Promise<Response> {
  try {
    const response = await AgentController.getAgent(context.params.id);
    return NextResponse.json(response);
  } catch (error) {
    const { status, message } = ErrorHandler.getErrorResponse(
      error instanceof Error ? error : new Error('Failed to get agent')
    );
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const data = await request.json();
    const response = await AgentController.updateAgent(params.id, data);
    return NextResponse.json(response);
  } catch (error) {
    const { status, message } = ErrorHandler.getErrorResponse(
      error instanceof Error ? error : new Error('Failed to update agent')
    );
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    await AgentController.deleteAgent(params.id);
    return NextResponse.json(
      { message: 'Agent deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    const { status, message } = ErrorHandler.getErrorResponse(
      error instanceof Error ? error : new Error('Failed to delete agent')
    );
    return NextResponse.json({ error: message }, { status });
  }
}
