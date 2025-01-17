# Shared Components Library

A collection of reusable, accessible, and customizable React components built with TypeScript and
Tailwind CSS.

## Component Categories

### Form Components

Components for building forms and handling user input.

- `Button`: A versatile button component with multiple variants, sizes, and states
- `Input`: A flexible input component with validation states and icons
- `Select`: A customizable select component with validation states

### Feedback Components

Components for displaying feedback and notifications to users.

- `Alert`: A versatile alert component for messages and notifications
- `ErrorBoundary`: A component for handling and displaying runtime errors

### Navigation Components

Components for handling navigation and routing.

- `Link`: An enhanced link component with proper accessibility
- `Logo`: A component for displaying the application logo
- `ProtectedRoute`: A component for handling authenticated routes

## Features

- 🎨 Fully customizable with Tailwind CSS
- ♿️ Accessible by default (WAI-ARIA compliant)
- 🌙 Dark mode support
- 📱 Responsive design
- 🔒 Type-safe with TypeScript
- 🎯 Zero-dependency (except for React and Tailwind)

## Usage

Import components from the shared components library:

```tsx
import { Alert, Button, Input } from '@/components/shared';

function MyComponent() {
  return (
    <div>
      <Alert type="info" title="Welcome" message="This is a demo component" />
      <Input label="Email" type="email" required />
      <Button variant="primary">Submit</Button>
    </div>
  );
}
```

## Best Practices

1. **Accessibility**

   - Always provide labels for form elements
   - Use appropriate ARIA attributes
   - Ensure keyboard navigation works
   - Test with screen readers

2. **Error Handling**

   - Use ErrorBoundary components to catch runtime errors
   - Provide meaningful error messages
   - Handle loading and error states appropriately

3. **Performance**

   - Use dynamic imports for large components
   - Avoid unnecessary re-renders
   - Optimize images and icons

4. **Styling**
   - Use Tailwind CSS utility classes
   - Follow dark mode conventions
   - Maintain consistent spacing
   - Use design tokens for colors

## Contributing

When adding new components:

1. Follow the established directory structure
2. Add proper TypeScript types
3. Include JSDoc documentation
4. Add usage examples
5. Ensure accessibility
6. Add dark mode support
7. Test thoroughly
