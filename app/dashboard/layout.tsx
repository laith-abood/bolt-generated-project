'use client';

import { useAuth } from 'features/auth';
import { DashboardLayout } from 'features/dashboard/components/layouts';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useAuth hook
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
