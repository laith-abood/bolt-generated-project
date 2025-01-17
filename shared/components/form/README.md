# Form Components

A collection of accessible, customizable form components built with React and TypeScript.

## Features

- 🎨 Consistent styling with Tailwind CSS
- ♿️ Full accessibility support (ARIA, keyboard navigation)
- 📱 Responsive design
- 🌙 Dark mode support
- 🔍 Form validation
- ⌨️ Type-safe props
- 🎯 Focus management
- 🔄 Loading states

## Components

### Form

Top-level form component with built-in validation and submission handling.

```tsx
import { Button, Form, Input } from '@/shared/components/form';

function LoginForm() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Handle form submission
  };

  return (
    <Form onSubmit={handleSubmit} onError={console.error}>
      <Input label="Email" type="email" name="email" required />
      <Input label="Password" type="password" name="password" required />
      <Button type="submit">Log In</Button>
    </Form>
  );
}
```

### FormField

Wrapper component for consistent field layout and styling.

```tsx
<FormField label="Username" helperText="Choose a unique username" error={errors.username}>
  <Input name="username" />
</FormField>
```

### Input

Text input component with validation and error states.

```tsx
<Input
  label="Email"
  type="email"
  name="email"
  placeholder="Enter your email"
  helperText="We'll never share your email"
  error={errors.email}
  required
/>
```

### Select

Dropdown selection component with option groups.

```tsx
<Select
  label="Country"
  name="country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' },
  ]}
  groups={[
    {
      label: 'North America',
      options: ['us', 'ca', 'mx'],
    },
  ]}
/>
```

### Checkbox

Single checkbox component with indeterminate state support.

```tsx
<Checkbox label="I agree to the terms" name="terms" required />
```

### CheckboxGroup

Multiple selection component.

```tsx
<CheckboxGroup
  label="Interests"
  name="interests"
  options={[
    { value: 'sports', label: 'Sports' },
    { value: 'music', label: 'Music' },
    { value: 'art', label: 'Art' },
  ]}
/>
```

### Radio

Single radio button component.

```tsx
<Radio label="Yes" name="answer" value="yes" />
```

### RadioGroup

Radio button group for single selection.

```tsx
<RadioGroup
  label="Subscription"
  name="plan"
  options={[
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ]}
/>
```

### TextArea

Multi-line text input with auto-resize support.

```tsx
<TextArea label="Message" name="message" rows={4} autoResize maxRows={10} />
```

## Usage

### Basic Form

```tsx
import { Button, Form, Input } from '@/shared/components/form';

function ContactForm() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Form handling
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input label="Name" name="name" required />
      <Input label="Email" type="email" name="email" required />
      <TextArea label="Message" name="message" required />
      <Button type="submit">Send Message</Button>
    </Form>
  );
}
```

### Form Validation

```tsx
function ValidatedForm() {
  const handleError = (errors: Record<string, string>) => {
    console.error('Validation errors:', errors);
  };

  return (
    <Form onError={handleError}>
      <Input
        label="Username"
        name="username"
        minLength={3}
        maxLength={20}
        pattern="[a-zA-Z0-9]+"
        required
      />
    </Form>
  );
}
```

### Loading State

```tsx
function SubmitForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Form
      isSubmitting={isSubmitting}
      onSubmit={async () => {
        setIsSubmitting(true);
        try {
          await submitData();
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      {/* Form fields */}
    </Form>
  );
}
```

## Accessibility

All components follow WAI-ARIA guidelines and include:

- Proper ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader support
- Error announcements
- Loading state indicators

## Styling

Components use Tailwind CSS for styling and support:

- Dark mode
- Custom colors
- Responsive design
- Focus states
- Hover effects
- Loading states
- Error states

## TypeScript Support

All components are written in TypeScript and provide:

- Type-safe props
- Proper event types
- Enum support
- Generic types
- Strict null checks
- Type inference

## Best Practices

1. Always provide labels for form fields
2. Use helper text to provide additional context
3. Show clear error messages
4. Handle loading states
5. Implement proper form validation
6. Use appropriate input types
7. Group related fields
8. Maintain consistent styling
