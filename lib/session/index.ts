import type { User } from '@/types';

export interface Session {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

export interface SessionManager {
  getSession: () => Promise<Session | null>;
  setSession: (session: Session) => Promise<void>;
  clearSession: () => Promise<void>;
  refreshSession: () => Promise<Session | null>;
  isSessionValid: () => boolean;
  getToken: () => string | null;
  getRefreshToken: () => string | null;
}

export class SessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SessionError';
  }
}

export const createSession = (
  user: User | null,
  token: string | null,
  refreshToken: string | null,
  expiresIn: number = 3600
): Session => ({
  user,
  token,
  refreshToken,
  expiresAt: token ? Date.now() + expiresIn * 1000 : null,
});

export const isSessionExpired = (session: Session | null): boolean => {
  if (!session?.expiresAt) return true;
  return Date.now() >= session.expiresAt;
};
