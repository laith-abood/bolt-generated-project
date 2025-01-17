import type { AuthUser } from '@/features/auth/types';
import { errorService } from '@/lib/errors';

interface SessionConfig {
  inactivityTimeout: number;
  absoluteTimeout: number;
  renewalThreshold: number;
  maxConcurrentSessions: number;
}

interface SessionCallbacks {
  onTimeout: () => void;
  onRefreshNeeded: () => Promise<void>;
  onConcurrentSession: () => void;
}

export class SessionService {
  private static instance: SessionService;
  private config: SessionConfig;
  private lastActivity: number = Date.now();
  private sessionStart: number = Date.now();
  private timeoutId: NodeJS.Timeout | null = null;
  private renewalId: NodeJS.Timeout | null = null;
  private callbacks: SessionCallbacks | null = null;

  private constructor(config: SessionConfig) {
    this.config = config;
  }

  public static getInstance(config: SessionConfig): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService(config);
    }
    return SessionService.instance;
  }

  public initialize(callbacks: SessionCallbacks): () => void {
    this.callbacks = callbacks;
    this.setupTimeouts();
    this.setupActivityListeners();

    // Return cleanup function
    return () => {
      this.cleanup();
    };
  }

  private setupTimeouts(): void {
    // Clear any existing timeouts
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if (this.renewalId) {
      clearTimeout(this.renewalId);
    }

    // Set inactivity timeout
    this.timeoutId = setTimeout(() => {
      this.handleTimeout();
    }, this.config.inactivityTimeout);

    // Set renewal reminder
    this.renewalId = setTimeout(() => {
      this.handleRenewalNeeded();
    }, this.config.absoluteTimeout - this.config.renewalThreshold);
  }

  private setupActivityListeners(): void {
    const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];

    const handleActivity = () => {
      this.updateActivity();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Store event cleanup
    this.cleanup = () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      if (this.renewalId) {
        clearTimeout(this.renewalId);
      }
    };
  }

  private updateActivity(): void {
    const now = Date.now();
    const timeSinceStart = now - this.sessionStart;

    // Check absolute timeout
    if (timeSinceStart >= this.config.absoluteTimeout) {
      this.handleTimeout();
      return;
    }

    this.lastActivity = now;
    this.setupTimeouts();
  }

  private async handleTimeout(): Promise<void> {
    try {
      if (this.callbacks) {
        await this.callbacks.onTimeout();
      }
    } catch (err) {
      const error = new Error(
        err instanceof Error ? err.message : 'Session timeout handling failed'
      );
      void errorService.handleError(error, {
        action: 'SessionService.handleTimeout',
      });
    }
  }

  private async handleRenewalNeeded(): Promise<void> {
    try {
      if (this.callbacks) {
        await this.callbacks.onRefreshNeeded();
        this.sessionStart = Date.now(); // Reset session start time after successful renewal
        this.setupTimeouts();
      }
    } catch (err) {
      const error = new Error(
        err instanceof Error ? err.message : 'Session renewal failed'
      );
      void errorService.handleError(error, {
        action: 'SessionService.handleRenewalNeeded',
      });
      this.handleTimeout();
    }
  }

  public async validateSession(user: AuthUser | null): Promise<boolean> {
    if (!user) {
      return false;
    }

    const timeSinceStart = Date.now() - this.sessionStart;
    const timeSinceActivity = Date.now() - this.lastActivity;

    // Check timeouts
    if (
      timeSinceStart >= this.config.absoluteTimeout ||
      timeSinceActivity >= this.config.inactivityTimeout
    ) {
      await this.handleTimeout();
      return false;
    }

    return true;
  }

  private cleanup: () => void = () => {
    // Default cleanup implementation, will be overwritten in setupActivityListeners
  };

  public destroy(): void {
    this.cleanup();
    this.callbacks = null;
  }
}

// Default session configuration
const DEFAULT_CONFIG: SessionConfig = {
  inactivityTimeout: 30 * 60 * 1000, // 30 minutes
  absoluteTimeout: 8 * 60 * 60 * 1000, // 8 hours
  renewalThreshold: 5 * 60 * 1000, // 5 minutes
  maxConcurrentSessions: 1,
};

export const sessionService = SessionService.getInstance(DEFAULT_CONFIG);
