/**
 * ProtectedRoute Component
 *
 * A component for protecting routes that require authentication or specific
 * user roles. Handles loading states and redirects.
 *
 * @example
 * ```tsx
 * // Basic protected route
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 *
 * // Role-specific route
 * <ProtectedRoute requiredRole="admin">
 *   <AdminPanel />
 * </ProtectedRoute>
 * ```
 */
import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { useAuth } from '@/features/auth';
import { getConfig } from '@/lib/config';

import { Alert } from '../feedback/Alert';

export interface ProtectedRouteProps {
  /** The content to render when authenticated */
  children: React.ReactNode;
  /** Required role to access the route */
  requiredRole?: string;
  /** Fallback component to show while loading */
  fallback?: React.ReactNode;
  /** URL to redirect to when unauthorized */
  redirectUrl?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
  redirectUrl = '/login',
}: ProtectedRouteProps): JSX.Element {
  const router = useRouter();
  const { user, loading, error } = useAuth();
  const isDevelopment = getConfig('env').NODE_ENV === 'development';

  useEffect(() => {
    if (!loading && !user) {
      void router.replace({
        pathname: redirectUrl,
        query: { returnUrl: router.asPath },
      });
    }
  }, [loading, user, router, redirectUrl]);

  // Show loading state
  if (loading) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4">
        <Alert
          type="error"
          title="Authentication Error"
          message={
            isDevelopment
              ? error.message
              : 'Failed to authenticate. Please try again.'
          }
        />
      </div>
    );
  }

  // Handle unauthorized access
  if (!user) {
    return <></>;
  }

  // Handle role-based access
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="p-4">
        <Alert
          type="error"
          title="Access Denied"
          message="You don't have permission to access this page."
        />
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
}
