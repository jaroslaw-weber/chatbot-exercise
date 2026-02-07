# Utils Module

This module provides utility functions used across the application.

## Purpose

Contains shared helper functions for common operations.

## Components

### `validation.ts`
- validate() function for type-safe data validation
- Generic validation wrapper around Zod schemas
- Provides error logging context

## Functions

### `validate<TSchema>(data, schema, context)`
Validates data against a Zod schema and returns a typed result.

**Parameters:**
- `data: unknown` - Data to validate
- `schema: TSchema` - Zod schema to validate against
- `context: string` - Context for error messages (default: "request")

**Returns:**
- `{ success: true, data: T }` - On success, with typed data
- `{ success: false, error: ZodError }` - On failure, with validation error

**Example:**
```typescript
const result = validate(data, WebhookBodySchema, 'webhook body');
if (result.success) {
  const validData = result.data; // Type is inferred
} else {
  console.error('Validation failed:', result.error);
}
```

## Design Benefits

- Type-safe validation
- Consistent error handling
- Reusable across modules
- Context-aware error messages
