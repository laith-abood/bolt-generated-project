# Dashboard Feature Module

A comprehensive dashboard module providing type-safe dashboard functionality with real-time data
updates and performance monitoring.

## Features

- 📊 Real-time performance metrics
- 📈 Sales analytics
- 📱 Responsive dashboard layouts
- 🔄 Auto-refreshing data
- 📊 Interactive charts
- 🎯 Performance optimization
- 🎨 Customizable views

## Installation

The module is pre-configured for the project. Ensure Firebase is properly initialized:

```typescript
import firebase from '@core/firebase';
import dashboard from '@features/dashboard';

// Initialize Firebase
await firebase.initialize();

// Use dashboard components
function App() {
  return (
    <dashboard.Layout>
      <dashboard.Overview />
    </dashboard.Layout>
  );
}
```

## Usage

### Dashboard Components

```typescript
import { AgentDashboard, OwnerDashboard } from '@features/dashboard/components';

function DashboardPage() {
  const { user } = useAuth();

  return user?.role === 'owner' ? (
    <OwnerDashboard />
  ) : (
    <AgentDashboard />
  );
}
```

### Dashboard Hooks

```typescript
import { useDashboardStats } from '@features/dashboard/hooks';

function PerformanceMetrics() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div>
      <h2>Performance Metrics</h2>
      <MetricsDisplay stats={stats} />
    </div>
  );
}
```

### Dashboard Services

```typescript
import { dashboardService } from '@features/dashboard/services';

// Fetch custom date range data
const metrics = await dashboardService.getMetrics({
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-31'),
});
```

## Architecture

### Components

- `DashboardLayout`: Main dashboard layout component
- `AgentDashboard`: Agent-specific dashboard view
- `OwnerDashboard`: Owner-specific dashboard view
- `PerformanceMetrics`: Metrics display component
- `SalesChart`: Interactive sales visualization
- `AgentList`: Agent management component

### Hooks

- `useDashboardStats`: Hook for dashboard statistics
- `usePerformanceMetrics`: Hook for performance data
- `useSalesAnalytics`: Hook for sales analysis

### Services

- `DashboardService`: Core dashboard data service
- `MetricsService`: Performance metrics service
- `AnalyticsService`: Sales analytics service

### Types

```typescript
interface DashboardStats {
  totalCalls: number;
  totalSales: number;
  conversionRate: number;
  performance: {
    daily: MetricData[];
    weekly: MetricData[];
    monthly: MetricData[];
  };
}

interface MetricData {
  date: Date;
  value: number;
  trend: 'up' | 'down' | 'stable';
}

interface DashboardConfig {
  refreshInterval: number;
  defaultDateRange: DateRange;
  metrics: string[];
}
```

## Configuration

The dashboard module can be configured through the DashboardService:

```typescript
import { DashboardService } from '@features/dashboard';

const config = {
  refreshInterval: 5 * 60 * 1000, // 5 minutes
  defaultDateRange: 'week',
  metrics: ['calls', 'sales', 'conversion'],
};

const dashboardService = DashboardService.getInstance(config);
```

## Error Handling

The module provides comprehensive error handling:

```typescript
try {
  const stats = await dashboardService.getStats();
} catch (error) {
  if (error instanceof DashboardError) {
    // Handle specific dashboard errors
    console.error(error.code, error.message);
  }
}
```

## Best Practices

1. **Performance**

   - Implement proper data caching
   - Use virtualization for long lists
   - Optimize re-renders
   - Use proper memoization

2. **Real-time Updates**

   - Implement proper websocket handling
   - Use optimistic updates
   - Handle offline scenarios
   - Implement proper retry logic

3. **Data Visualization**

   - Use appropriate chart types
   - Implement proper tooltips
   - Handle responsive layouts
   - Implement proper loading states

4. **Accessibility**
   - Implement proper ARIA labels
   - Ensure keyboard navigation
   - Provide proper color contrast
   - Support screen readers

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
# Run dashboard module tests
npm test src/features/dashboard

# Run specific test file
npm test src/features/dashboard/services/DashboardService.test.ts
```

## Dependencies

- Firebase Firestore
- React 18+
- TypeScript 4.5+
- Chart.js (or preferred charting library)
- React Query (for data fetching)

## License

This module is part of the main application and follows its licensing.
