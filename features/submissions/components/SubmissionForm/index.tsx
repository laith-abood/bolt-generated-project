import React from 'react';

import { Alert } from '@/shared/components/feedback';
import { Button, Input, Select } from '@/shared/components/form';

import { useSubmissionForm } from '../../hooks/useSubmissionForm';

const PLAN_TYPES = ['A', 'B', 'C', 'D', 'F', 'G', 'K', 'L', 'M', 'N'] as const;

const SubmissionFormComponent = (): JSX.Element => {
  const {
    register,
    fields,
    errors,
    isSubmitting,
    onSubmit,
    handleAddSale,
    remove,
  } = useSubmissionForm();

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="space-y-4">
        <Input
          label="Total Calls"
          type="number"
          min={0}
          max={1000}
          error={errors.totalCalls?.message}
          {...register('totalCalls', { valueAsNumber: true })}
          required
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Sales</h3>
            <Button
              type="button"
              onClick={handleAddSale}
              variant="secondary"
              size="sm"
            >
              Add Sale
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border rounded-md space-y-4 bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Sale {index + 1}</h4>
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="danger"
                  size="sm"
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Plan Type"
                  error={errors.sales?.[index]?.planType?.message}
                  {...register(`sales.${index}.planType`)}
                  required
                >
                  <option value="">Select plan type...</option>
                  {PLAN_TYPES.map((type) => (
                    <option key={type} value={type}>
                      Plan {type}
                    </option>
                  ))}
                </Select>

                <Input
                  type="date"
                  label="Effective Date"
                  error={errors.sales?.[index]?.effectiveDate?.message}
                  {...register(`sales.${index}.effectiveDate`)}
                  required
                />

                <div className="md:col-span-2">
                  <Input
                    type="text"
                    label="Notes"
                    error={errors.sales?.[index]?.notes?.message}
                    {...register(`sales.${index}.notes`)}
                    placeholder="Optional notes about this sale"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <Input
            type="text"
            label="Additional Notes"
            error={errors.notes?.message}
            {...register('notes')}
            placeholder="Optional notes about this submission"
          />
        </div>
      </div>

      {errors.root?.message && (
        <Alert type="error" title="Error" message={errors.root.message} />
      )}

      <Button
        type="submit"
        variant="primary"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        fullWidth
        className="w-full"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
};

export const SubmissionForm = React.memo(SubmissionFormComponent) as React.FC<
  Record<string, never>
>;
