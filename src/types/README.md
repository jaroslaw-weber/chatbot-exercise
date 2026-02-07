# Types Module

This module contains TypeScript type definitions for the application.

## Purpose

Defines core types and interfaces used throughout the finance tracker.

## Components

### `transaction.ts`
- ParsedTransaction interface

## Types

### `ParsedTransaction`
Represents a transaction parsed from natural language by the AI.

**Properties:**
- `amount: number` - Transaction amount
- `item: string` - Item or service name
- `category: string` - Transaction category
- `store?: string` - Store or vendor name (optional)

**Example:**
```typescript
const transaction: ParsedTransaction = {
  amount: 5.50,
  item: 'coffee',
  category: 'food',
  store: 'Starbucks'
};
```

## Usage

This type is used to:
- Define the return type from AI parsing
- Validate parsed transaction data
- Type transaction creation operations

## Related Types

Other transaction types are defined in:
- `src/db/transaction/schema.ts` - Database schema types
- `src/finance/schemas.ts` - Validation schemas
