import type { AuthUser } from '@/features/auth/types';
import type { Permission } from '@/types';

class SessionManager {
  private static instance: SessionManager;
  private currentUser: AuthUser | null = null;

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  setCurrentUser(user: AuthUser | null): void {
    this.currentUser = user;
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  clearSession(): void {
    this.currentUser = null;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  hasPermission(permission: Permission): boolean {
    if (!this.currentUser) return false;

    // Map roles to permissions
    const rolePermissions: Record<string, string[]> = {
      owner: [
        'view_reports',
        'manage_agents',
        'manage_agency',
        'view_submissions',
        'edit_submissions',
      ],
      agent: ['view_submissions', 'create_submissions', 'edit_own_submissions'],
    };

    const userPermissions = rolePermissions[this.currentUser.role] || [];
    return userPermissions.includes(permission);
  }
}

export const getSessionManager = (): SessionManager =>
  SessionManager.getInstance();
export type { SessionManager };
