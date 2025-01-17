import { z } from 'zod';

import React from 'react';

export interface ValidationError {
  path: Array<string | number>;
  message: string;
}

interface UseFormValidationOptions<T> {
  schema: z.ZodObject<z.ZodRawShape>;
  onSubmit: (data: T) => Promise<void>;
  onError?: (errors: ValidationError[]) => void;
}

interface FormValidationState<T> {
  data: Partial<T>;
  errors: Record<string, string | undefined>;
  isSubmitting: boolean;
  isDirty: boolean;
}

interface FormValidationActions<T> {
  setFieldValue: (field: keyof T, value: unknown) => void;
  validateField: (field: keyof T) => void;
  validateForm: () => boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: () => void;
}

function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): {
  success: boolean;
  errors?: ValidationError[];
} {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map((error) => ({
        path: error.path,
        message: error.message,
      })),
    };
  }
  return { success: true };
}

/**
 * Custom hook for form validation using Zod schemas
 * @param options Form validation options including schema and submit handler
 * @returns Form validation state and actions
 */
export function useFormValidation<T extends Record<string, unknown>>({
  schema,
  onSubmit,
  onError,
}: UseFormValidationOptions<T>): [
  FormValidationState<T>,
  FormValidationActions<T>,
] {
  const [state, setState] = React.useState<FormValidationState<T>>({
    data: {},
    errors: {},
    isSubmitting: false,
    isDirty: false,
  });

  const setFieldValue = React.useCallback((field: keyof T, value: unknown) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      isDirty: true,
      errors: {
        ...prev.errors,
        [field]: undefined, // Clear field error when value changes
      },
    }));
  }, []);

  const validateField = React.useCallback(
    (field: keyof T) => {
      const fieldSchema = schema.shape[field as keyof z.infer<typeof schema>];
      if (!fieldSchema) {
        setState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            [field]: 'Invalid field',
          },
        }));
        return;
      }

      const singleFieldSchema = z.object({ [field]: fieldSchema });
      const result = validateData(singleFieldSchema, {
        [field]: state.data[field],
      });

      setState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          [field]: result.success ? undefined : result.errors?.[0]?.message,
        },
      }));
    },
    [schema, state.data]
  );

  const validateForm = React.useCallback((): boolean => {
    const result = validateData(schema, state.data);

    if (!result.success) {
      const formattedErrors = result.errors?.reduce<
        Record<string, string | undefined>
      >(
        (acc, error) => ({
          ...acc,
          [error.path.join('.')]: error.message,
        }),
        {}
      );

      setState((prev) => ({
        ...prev,
        errors: formattedErrors ?? {},
      }));

      onError?.(result.errors ?? []);
      return false;
    }

    return true;
  }, [schema, state.data, onError]);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setState((prev) => ({ ...prev, isSubmitting: true }));

      try {
        await onSubmit(state.data as T);
        setState((prev) => ({
          ...prev,
          isDirty: false,
          errors: {},
        }));
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Form submission failed');
        setState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            submit: error.message,
          },
        }));
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [validateForm, onSubmit, state.data]
  );

  const reset = React.useCallback(() => {
    setState({
      data: {},
      errors: {},
      isSubmitting: false,
      isDirty: false,
    });
  }, []);

  return [
    state,
    {
      setFieldValue,
      validateField,
      validateForm,
      handleSubmit,
      reset,
    },
  ];
}
