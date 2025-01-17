# Firebase Core Module

A robust, type-safe Firebase implementation with enhanced error handling, caching, and performance
optimizations.

## Features

- ✨ Type-safe Firebase operations
- 🔄 Automatic retry mechanism
- 📦 Query result caching
- 🛡️ Enhanced error handling
- 🎯 Batch operations support
- 🔒 Proper cleanup and resource management

## Installation

The module is pre-configured for the project. Ensure you have the required environment variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Usage

### Initialize Firebase

```typescript
import firebase from '@core/firebase';

// Initialize Firebase services
await firebase.initialize();
```

### Firestore Operations

```typescript
import { firestoreService } from '@core/firebase';

// Define your document type
interface User {
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Get a document
const user = await firestoreService.getDocument<User>('users/123');

// Set a document
await firestoreService.setDocument<User>('users/123', {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
});

// Update a document
await firestoreService.updateDocument<User>('users/123', {
  name: 'John Smith',
});

// Delete a document
await firestoreService.deleteDocument('users/123');
```

### Query Operations

```typescript
import { firestoreService } from '@core/firebase';
import { collection, query, where } from 'firebase/firestore';

// Execute a query with caching
const result = await firestoreService.executeQuery<User>(
  query(collection(db, 'users'), where('role', '==', 'admin')),
  { cacheDuration: 5 * 60 * 1000 } // 5 minutes cache
);
```

### Batch Operations

```typescript
import { firestoreService } from '@core/firebase';

// Execute multiple operations in a batch
await firestoreService.executeBatch([
  {
    type: 'set',
    path: 'users/123',
    data: { name: 'John Doe', role: 'user' },
  },
  {
    type: 'update',
    path: 'users/456',
    data: { lastLogin: new Date() },
  },
  {
    type: 'delete',
    path: 'users/789',
  },
]);
```

### Error Handling

```typescript
import { FirebaseAuthError, FirebaseErrorHandler } from '@core/firebase';

try {
  // Your Firebase operations
} catch (error) {
  if (error instanceof FirebaseAuthError) {
    console.error('Auth error:', error.code, error.message);
  } else {
    FirebaseErrorHandler.logError(error);
  }
}
```

### Cleanup

```typescript
import firebase from '@core/firebase';

// Cleanup Firebase resources
await firebase.cleanup();
```

## Advanced Features

### Custom Query Caching

```typescript
import { firestoreService } from '@core/firebase';

// Clear entire cache
firestoreService.clearCache();

// Clear cache for specific query
firestoreService.clearCacheForQuery(query);
```

### Transaction Support

```typescript
import { firestoreService } from '@core/firebase';

const result = await firestoreService.executeTransaction(async (transaction) => {
  // Your transaction operations
  return result;
});
```

## Error Types

- `FirebaseAuthError`: Authentication-related errors
- `FirestoreError`: Firestore operation errors
- `AnalyticsError`: Analytics-related errors

## Best Practices

1. **Type Safety**

   - Always define interfaces for your document types
   - Use type parameters with service methods

2. **Error Handling**

   - Catch and handle specific error types
   - Use the error handler for consistent logging

3. **Resource Management**

   - Initialize Firebase at app startup
   - Clean up resources when shutting down

4. **Performance**
   - Use query caching for frequently accessed data
   - Batch related operations together
   - Use transactions for atomic operations

## Contributing

When contributing to this module:

1. Maintain type safety
2. Add proper error handling
3. Update tests for new features
4. Document new functionality
5. Follow the existing patterns

## Architecture

The module is organized into several key components:

- `config.ts`: Configuration management
- `initialize.ts`: Firebase initialization
- `database.ts`: Firestore operations
- `errors.ts`: Error handling
- `types.ts`: Type definitions

Each component is designed to be modular and maintainable while providing a cohesive API surface.
