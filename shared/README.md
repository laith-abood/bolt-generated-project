# Shared Module

A collection of reusable components, hooks, and utilities used across the application.

## Structure

```plaintext
shared/
├── components/         # Reusable UI components
│   ├── feedback/      # Loading, error, and notification components
│   ├── form/          # Form components and controls
│   ├── layout/        # Layout components
│   └── data/          # Data display components
├── hooks/             # Common hooks
└── utils/             # Utility functions
```

## Components

### Feedback Components

- `LoadingSpinner`: Loading indicator with customizable size and color
- `ErrorDisplay`: Error message display with optional retry action
- `Toast`: Notification toast messages
- `EmptyState`: Empty state placeholder with customizable message and icon

### Form Components

- `Button`: Customizable button with variants and states
- `Input`: Text input with validation and error states
- `Select`: Dropdown select with search and multi-select
- `DatePicker`: Date selection with range support
- `Checkbox`: Checkbox input with label and indeterminate state
- `RadioGroup`: Radio button group
- `Switch`: Toggle switch
- `FormField`: Form field wrapper with label and error handling

### Layout Components

- `Card`: Content container with header, body, and footer
- `Modal`: Modal dialog with customizable header and actions
- `Drawer`: Slide-out drawer with customizable position
- `Tabs`: Tab navigation with content panels
- `Collapse`: Collapsible content section
- `Divider`: Horizontal or vertical divider

### Data Components

- `Table`: Data table with sorting and selection
- `Pagination`: Page navigation controls
- `Badge`: Status badge with variants
- `Tag`: Tag component with optional close button
- `Avatar`: User avatar with fallback
- `Icon`: Icon component with common icons

## Hooks

- `useDebounce`: Debounce value changes
- `useThrottle`: Throttle function calls
- `useLocalStorage`: Local storage state management
- `useMediaQuery`: Responsive media queries
- `useClickOutside`: Detect clicks outside element
- `usePrevious`: Access previous value
- `useAsync`: Async operation state management

## Utils

- `date`: Date formatting and manipulation
- `number`: Number formatting and calculations
- `string`: String manipulation and validation
- `array`: Array manipulation utilities
- `object`: Object manipulation utilities
- `validation`: Common validation functions

## Usage

### Components

```typescript
import { Button, Input, LoadingSpinner } from '@/shared/components';

function MyComponent() {
  return (
    <div>
      <Input
        label="Name"
        value={name}
        onChange={setName}
        error={errors.name}
      />
      <Button
        variant="primary"
        loading={isLoading}
        onClick={handleSubmit}
      >
        Submit
      </Button>
      {isLoading && <LoadingSpinner size="lg" />}
    </div>
  );
}
```

### Hooks

```typescript
import { useDebounce, useAsync } from '@/shared/hooks';

function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, loading, error } = useAsync(
    () => searchApi(debouncedSearch),
    [debouncedSearch]
  );

  return (
    // Component implementation
  );
}
```

### Utils

```typescript
import { date, validation } from '@/shared/utils';

const formattedDate = date.format(new Date(), 'MM/DD/YYYY');
const isValid = validation.email('user@example.com');
```

## Best Practices

1. **Component Design**

   - Keep components focused and reusable
   - Use TypeScript for type safety
   - Implement proper prop validation
   - Follow accessibility guidelines
   - Support dark mode

2. **Performance**

   - Implement proper memoization
   - Optimize re-renders
   - Use lazy loading when appropriate
   - Implement proper error boundaries

3. **Accessibility**

   - Use semantic HTML
   - Implement ARIA attributes
   - Support keyboard navigation
   - Maintain proper contrast
   - Handle screen readers

4. **Testing**
   - Write unit tests for utilities
   - Test components with React Testing Library
   - Test accessibility
   - Test error states
   - Test edge cases

## Contributing

When adding new shared components or utilities:

1. Follow existing patterns
2. Add proper documentation
3. Include usage examples
4. Add comprehensive tests
5. Consider accessibility
6. Consider performance
7. Consider reusability

## Dependencies

- React 18+
- TypeScript 4.5+
- Tailwind CSS
- date-fns (date utilities)
- clsx (class name utilities)
