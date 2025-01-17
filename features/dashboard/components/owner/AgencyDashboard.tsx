import { collection, getDocs, query, where } from 'firebase/firestore';

import React from 'react';
import { useEffect, useState } from 'react';

import { db } from '@/lib/firebase';
import { useAuth } from '@/features/auth';
import type { User } from '@/types';

export const AgencyDashboard = (): JSX.Element => {
  const [agents, setAgents] = useState<User[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAgents = async () => {
      if (!user?.agencyId || !db) return;

      try {
        const q = query(
          collection(db, 'users'),
          where('agencyId', '==', user.agencyId),
          where('role', '==', 'agent')
        );

        const snapshot = await getDocs(q);
        setAgents(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as User[]
        );
      } catch (error) {
        console.error('Error fetching agents:', error);
        setAgents([]);
      }
    };

    void fetchAgents();
  }, [user]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Agency Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="p-4 border rounded-lg shadow">
            <h3 className="font-semibold">{agent.name}</h3>
            <p className="text-gray-600">{agent.email}</p>
            <p className="text-sm text-gray-500">
              Last active: {agent.lastLogin?.toLocaleString() || 'Never'}
            </p>
          </div>
        ))}
      </div>
      {agents.length === 0 && (
        <p className="text-gray-500">No agents found for this agency.</p>
      )}
    </div>
  );
};
