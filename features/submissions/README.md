# Submissions Feature Module

A comprehensive submissions module providing type-safe submission management with real-time updates
and workflow capabilities.

## Features

- 📝 CRUD operations for submissions
- 🔄 Real-time updates
- 👥 Role-based access control
- ✅ Submission approval workflow
- 🔍 Advanced filtering and sorting
- 📊 Pagination support
- 🎯 Type-safe operations
- ⚡ Optimized performance

## Installation

The module is pre-configured for the project. Ensure Firebase is properly initialized:

```typescript
import firebase from '@core/firebase';
import submissions from '@features/submissions';

// Initialize Firebase
await firebase.initialize();

// Use submissions functionality
const { data } = await submissions.service.getSubmissions();
```

## Usage

### Hooks-based Usage

#### Managing Multiple Submissions

```typescript
import { useSubmissions } from '@features/submissions';

function SubmissionsList() {
  const {
    submissions,
    loading,
    error,
    loadMore,
    hasMore,
    createSubmission,
    updateSubmission,
    deleteSubmission,
    approveSubmission,
    rejectSubmission
  } = useSubmissions({
    limit: 10,
    autoRefresh: true,
    refreshInterval: 5000 // 5 seconds
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div>
      {submissions.map(submission => (
        <SubmissionCard
          key={submission.id}
          submission={submission}
          onApprove={() => approveSubmission(submission.id)}
          onReject={(reason) => rejectSubmission(submission.id, reason)}
          onDelete={() => deleteSubmission(submission.id)}
        />
      ))}
      {hasMore && (
        <Button onClick={loadMore}>Load More</Button>
      )}
    </div>
  );
}
```

#### Managing Single Submission

```typescript
import { useSubmission } from '@features/submissions';

function SubmissionDetails({ id }: { id: string }) {
  const {
    submission,
    loading,
    error,
    update,
    approve,
    reject,
    refresh
  } = useSubmission(id);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  if (!submission) return <NotFound />;

  return (
    <div>
      <h1>Submission Details</h1>
      <SubmissionForm
        submission={submission}
        onSubmit={update}
        onApprove={approve}
        onReject={reject}
      />
    </div>
  );
}
```

### Direct Service Usage

```typescript
import { submissionService } from '@features/submissions';

// Create submission
const newSubmission = await submissionService.createSubmission({
  agentId: 'agent-123',
  agencyId: 'agency-456',
  date: Timestamp.now(),
  totalCalls: 10,
  sales: [{ carrier: 'UnitedHealth', productType: 'advantage', count: 2 }],
});

// Query submissions with filters
const result = await submissionService.getSubmissions({
  filters: {
    agentId: 'agent-123',
    status: ['submitted', 'approved'],
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-31'),
  },
  sort: {
    field: 'date',
    direction: 'desc',
  },
  limit: 10,
});
```

## Architecture

### Components

- `SubmissionService`: Core submission management logic
- `useSubmissions`: Hook for managing multiple submissions
- `useSubmission`: Hook for managing single submission

### Types

```typescript
interface Submission {
  id: string;
  agentId: string;
  agencyId: string;
  date: Timestamp;
  totalCalls: number;
  sales: Sale[];
  status: SubmissionStatus;
  edited: boolean;
  // ... other fields
}

type SubmissionStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

interface Sale {
  carrier: string;
  productType: ProductType;
  count: number;
  revenue?: number;
}
```

## Error Handling

The module provides comprehensive error handling:

```typescript
try {
  await submissionService.approveSubmission(id);
} catch (error) {
  if (error instanceof SubmissionError) {
    switch (error.code) {
      case 'not_found':
        // Handle not found error
        break;
      case 'permission_denied':
        // Handle permission error
        break;
      case 'already_approved':
        // Handle already approved error
        break;
    }
  }
}
```

## Best Practices

1. **State Management**

   - Use hooks for component-level state
   - Use service for direct operations
   - Implement proper error handling
   - Handle loading states

2. **Performance**

   - Use pagination for large lists
   - Implement proper caching
   - Use optimistic updates
   - Handle offline scenarios

3. **Security**

   - Validate all inputs
   - Check permissions
   - Handle concurrent edits
   - Implement proper audit logging

4. **Data Consistency**
   - Validate submission data
   - Handle edge cases
   - Implement proper status transitions
   - Maintain audit trail

## Contributing

When contributing to this module:

1. Maintain type safety
2. Add proper error handling
3. Update tests for new features
4. Document new functionality
5. Follow the existing patterns

## Testing

The module includes comprehensive tests:

```bash
# Run submissions module tests
npm test src/features/submissions

# Run specific test file
npm test src/features/submissions/services/SubmissionService.test.ts
```

## Dependencies

- Firebase Firestore
- React 18+
- TypeScript 4.5+

## License

This module is part of the main application and follows its licensing.
