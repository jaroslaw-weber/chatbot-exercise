# Database Module

This module handles all database operations using Drizzle ORM with SQLite.

## Purpose

Provides type-safe database access for transaction storage, retrieval, and summarization.

## Architecture

- **ORM**: Drizzle ORM
- **Database**: SQLite (via Bun's built-in bun:sqlite)
- **Location**: ./data/finance.db
- **Migrations**: Located in ../../drizzle/

## Components

### `client.ts`
- Initializes SQLite database connection
- Creates Drizzle ORM instance
- Exports `db` instance for use across the application

### `config.ts`
- Defines database file path
- Configuration constants for database

### `index.ts`
- High-level database operations
- Exports convenience functions: addTransaction, getTransactions, getSummary, clearTransactions
- Re-exports schema and types

### `transaction/`

#### `schema.ts`
- Defines transactions table schema using Drizzle ORM
- Columns: id, phone_number, amount, item, category, store, created_at
- Auto-incrementing primary key
- Timestamp with default value
- TypeScript type inference for Transaction and NewTransaction

#### `index.ts`
- TransactionModel class with static methods
- CRUD operations for transactions
- Summary and aggregation queries

## Database Schema

```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone_number TEXT NOT NULL,
  amount REAL NOT NULL,
  item TEXT NOT NULL,
  category TEXT NOT NULL,
  store TEXT,
  created_at INTEGER NOT NULL
)
```

## TransactionModel Methods

### `add(transaction: NewTransaction)`
- Inserts a new transaction into the database
- Returns the created transaction record

### `getMany(phoneNumber: string, limit: number = 50)`
- Retrieves transactions for a specific phone number
- Orders by created_at descending (newest first)
- Limits results (default 50)

### `getSummary(phoneNumber: string)`
- Calculates total spent
- Counts transactions
- Groups by category with totals and counts
- Returns summary with category breakdown

### `clear(phoneNumber: string)`
- Deletes all transactions for a specific phone number

## Usage Example

```typescript
import { addTransaction, getTransactions, getSummary } from './db/index.js';

await addTransaction({
  phone_number: '5511999999999',
  amount: 5.50,
  item: 'coffee',
  category: 'food',
  store: 'Starbucks'
});

const transactions = await getTransactions('5511999999999', 10);
const summary = await getSummary('5511999999999');
```

## Type Safety

All database operations are fully typed thanks to Drizzle ORM:
- Insert operations use `NewTransaction` type
- Query results use `Transaction` type
- Compile-time type checking prevents errors
