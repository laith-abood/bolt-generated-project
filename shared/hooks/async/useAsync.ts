import { useCallback, useState } from 'react';

import { ErrorLogger } from '@/lib/errors/logger';

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

interface UseAsyncOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  errorContext?: Record<string, unknown>;
}

/**
 * Hook for handling async operations with loading and error states
 * @param asyncFunction The async function to execute
 * @param options Success/error callbacks and error context
 */
export function useAsync<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setState({ data: null, error: null, isLoading: true });
        const data = await asyncFunction(...args);
        setState({ data, error: null, isLoading: false });
        options.onSuccess?.(data);
        return data;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('An error occurred');
        setState({ data: null, error, isLoading: false });

        void ErrorLogger.logError(error, {
          action: 'async_operation',
          ...options.errorContext,
        });

        options.onError?.(error);
        throw error;
      }
    },
    [asyncFunction, options]
  );

  return {
    ...state,
    execute,
    reset: useCallback(() => {
      setState({ data: null, error: null, isLoading: false });
    }, []),
  };
}
