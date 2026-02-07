# Finance Module

This module contains all business logic for finance tracking and command processing.

## Purpose

Processes user messages, executes finance commands, and manages transaction operations.

## Components

### `service.ts`
- FinanceService class
- Main entry point for processing user messages
- Parses commands and routes to appropriate handlers
- Handles transaction parsing as fallback

### `controller.ts`
- FinanceController class
- HTTP request handler for webhook endpoints
- Validates incoming requests
- Coordinates between service and WhatsApp service
- Error handling for webhook processing

### `schemas.ts`
- Zod validation schemas for finance module
- WebhookBodySchema - validates incoming webhook payload
- MessageSchema - validates message format
- CommandSchema - validates command names
- parseCommand() - extracts command from text

### `commands/`
Command pattern implementation for finance operations.

#### `Command.ts`
- Base Command interface
- Defines contract for all commands
- Properties: name, aliases, execute()

#### `CommandRegistry.ts`
- CommandRegistry class
- Registers and manages all available commands
- Maps command names and aliases to handlers
- Singleton instance exported as commandRegistry

#### `TransactionCommand.ts`
- Handles natural language transaction creation
- Uses AI parser to extract transaction details
- Validates parsed data with Zod
- Saves transaction to database
- Returns confirmation message

#### `SummaryCommand.ts`
- Displays spending summary
- Shows total spent and transaction count
- Breaks down spending by category
- Alias: "total"

#### `HistoryCommand.ts`
- Shows recent transaction list (up to 10)
- Displays item, amount, category, store, and date
- Ordered by most recent
- Alias: "list"

#### `ClearCommand.ts`
- Deletes all transactions for the user
- No confirmation step (simplified implementation)
- Returns success message

#### `HelpCommand.ts`
- Displays usage instructions
- Shows transaction examples
- Lists available commands

## Available Commands

| Command | Aliases | Description |
|---------|---------|-------------|
| transaction | - | Add transaction from natural language |
| summary | total | Show spending summary |
| history | list | Show recent transactions |
| clear | - | Clear all transactions |
| help | - | Show help message |

## Message Flow

1. User sends message to WhatsApp
2. Webhook receives message (src/routes/webhook.ts)
3. FinanceController validates request
4. FinanceService.processMessage() is called
5. Command is parsed from text
6. CommandRegistry routes to appropriate command handler
7. Command executes and returns response
8. WhatsAppService sends response to user

## Example Usage

```typescript
import { FinanceService } from './finance/service.js';

const service = new FinanceService();
const message = {
  from: '5511999999999',
  text: 'summary'
};

const response = await service.processMessage(message);
console.log(response); // Summary message
```

## Command Pattern Benefits

- Easy to add new commands
- Each command is self-contained
- Commands can have aliases
- Centralized command registry
- Testable implementation
