import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { z } from 'zod';

import React, { type FormEvent, useState } from 'react';

import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/features/auth';
import { ErrorLogger } from '@/lib/errors/logger';
import { Button, Input } from '@/shared/components/form';

import { type NewAgent, agentSchema } from '../../schemas/agent';

export const AgentManagement = (): JSX.Element => {
  const { user } = useAuth();
  const [newAgent, setNewAgent] = useState<NewAgent>({
    email: '',
    name: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddAgent = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!user?.agencyId || !auth || !db) {
      setError('You must be logged in as an agency owner to add agents');
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Validate form data
      const validated = agentSchema.parse(newAgent);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        validated.email,
        validated.password
      );

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: validated.email,
        name: validated.name,
        role: 'agent',
        agencyId: user.agencyId,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      setNewAgent({ email: '', name: '', password: '' });
      setSuccess('Agent added successfully');
    } catch (err) {
      let errorMessage: string;

      if (err instanceof z.ZodError && err.errors.length > 0) {
        errorMessage = err.errors[0]?.message ?? 'Invalid form data';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        errorMessage = 'Failed to add agent';
      }

      setError(errorMessage);
      void ErrorLogger.logError(
        err instanceof Error ? err : new Error(errorMessage),
        { formData: { email: newAgent.email, name: newAgent.name } } // Don't log password
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    void handleAddAgent(e);
  };

  return (
    <div className="space-y-6 max-w-md">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Agent Management
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Add new agents to your agency
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-6"
        noValidate
        aria-describedby={error ? 'agent-form-error' : undefined}
      >
        <Input
          label="Name"
          type="text"
          id="name"
          name="name"
          value={newAgent.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewAgent((prev) => ({ ...prev, name: e.target.value }))
          }
          error={error?.includes('name') ? error : undefined}
          autoComplete="name"
          required
          isRequired
        />

        <Input
          label="Email"
          type="email"
          id="email"
          name="email"
          value={newAgent.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewAgent((prev) => ({ ...prev, email: e.target.value }))
          }
          error={error?.includes('email') ? error : undefined}
          autoComplete="email"
          required
          isRequired
        />

        <Input
          label="Password"
          type="password"
          id="password"
          name="password"
          value={newAgent.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewAgent((prev) => ({ ...prev, password: e.target.value }))
          }
          error={error?.includes('password') ? error : undefined}
          autoComplete="new-password"
          required
          isRequired
          helpText="Must be at least 8 characters"
        />

        {error &&
          !error.includes('name') &&
          !error.includes('email') &&
          !error.includes('password') && (
            <div
              id="agent-form-error"
              role="alert"
              className="text-error-light dark:text-error-dark text-sm"
            >
              {error}
            </div>
          )}

        {success && (
          <div
            role="status"
            className="text-success-light dark:text-success-dark text-sm"
          >
            {success}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          className="w-full"
        >
          {loading ? 'Adding Agent...' : 'Add Agent'}
        </Button>
      </form>
    </div>
  );
};
