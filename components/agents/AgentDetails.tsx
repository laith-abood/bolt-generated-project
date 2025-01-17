'use client';

import { getApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

import { useEffect, useState } from 'react';

import type { User } from '@/types';

interface AgentDetailsProps {
  agentId: string;
}

export default function AgentDetails({ agentId }: AgentDetailsProps) {
  const [agent, setAgent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAgent() {
      try {
        const app = getApp();
        const db = getFirestore(app);
        const agentRef = doc(db, 'users', agentId);
        const agentSnap = await getDoc(agentRef);

        if (agentSnap.exists()) {
          setAgent({
            id: agentSnap.id,
            ...(agentSnap.data() as Omit<User, 'id'>),
          });
        } else {
          setError('Agent not found');
        }
      } catch (err) {
        setError('Failed to load agent details');
        console.error('Error fetching agent:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAgent();
  }, [agentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!agent) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold mb-6">Agent Details</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Name</label>
          <p className="mt-1">{agent.name}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Email</label>
          <p className="mt-1">{agent.email}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Role</label>
          <p className="mt-1 capitalize">{agent.role}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Status</label>
          <p className="mt-1">
            {agent.disabled ? (
              <span className="text-red-600">Disabled</span>
            ) : (
              <span className="text-green-600">Active</span>
            )}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">
            Last Login
          </label>
          <p className="mt-1">
            {agent.lastLogin
              ? new Date(agent.lastLogin).toLocaleString()
              : 'Never'}
          </p>
        </div>
      </div>
    </div>
  );
}
