# WhatsApp Finance Tracker Chatbot

A personal finance tracking chatbot built with Hono framework, Bun runtime, and 360dialog Sandbox API. Uses Replicate AI for natural language transaction parsing.

## Features

- 📝 **Add transactions** via natural language: "bought coffee for $5 at Starbucks"
- 📊 **View summaries** with category breakdown: "summary"
- 📋 **Transaction history**: "history"
- 🗑️ **Clear data**: "clear"
- 🤖 **AI-powered parsing** using Replicate (OpenAI o4-mini)
- 💾 **SQLite database** for persistent storage (using Drizzle ORM)
- 👤 **Multi-user support** - Each phone number has separate data
- ✅ **Input validation** using Zod schemas

## Database

The application uses **Drizzle ORM** with **SQLite** for persistent data storage:

- **Location**: `./data/finance.db`
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Located in `./drizzle/` directory
- **Table**: `transactions` with fields for id, phone_number, amount, item, category, store, and created_at
- **Features**:
  - Auto-incrementing primary key
  - Timestamp tracking
  - Per-user data isolation (by phone number)
  - Category-based summarization
- **Operations**:
  - `addTransaction()` - Insert new transaction
  - `getTransactions()` - Retrieve transaction history with limit
  - `getSummary()` - Get total spent and category breakdown
  - `clearTransactions()` - Clear all data for a user

## Prerequisites

- Bun 1.0.0+ or Node.js 18.14.1+
- WhatsApp account
- Replicate API token ([get one here](https://replicate.com/account/api-tokens))

## Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Get API Keys

**360dialog**: Text "START" to `+551146733492` on WhatsApp. You'll receive an API key.

**Replicate**: Get a free API token at [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your credentials.

## Development

```bash
bun run dev
```

Server runs on `http://localhost:3000`

### Database Migrations

Run database migrations to set up the schema:

```bash
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

## Testing

The project includes a comprehensive test suite for verifying functionality:

### Unit Tests
Run Bun unit tests:
```bash
bun test
```

### Test Scripts

**Add Transaction Test**
Tests transaction parsing with Replicate AI and database insertion:
```bash
bun run test:add
bun run test:add "bought lunch for $15.50"
```

**Summary Test**
Displays recent transactions and summary breakdown:
```bash
bun run test:summary
```

**E2E Test**
Run end-to-end tests with multiple transaction scenarios:
```bash
bun run ./scripts/test-e2e.ts
```

## Usage

### Starting the Server

```bash
bun run dev
```

### Setting Up Webhook

Use ngrok to expose your localhost for testing:

```bash
ngrok http 3000
```

Then set the webhook URL in 360dialog:

```bash
curl -X POST https://waba-sandbox.360dialog.io/v1/configs/webhook \
  -H "Content-Type: application/json" \
  -H "D360-API-KEY: YOUR_D360_API_KEY" \
  -d '{"url": "https://your-ngrok-url.ngrok-free.app/webhook"}'
```

### Example Commands

Add transaction:
```
You: bought coffee for $5.50 at Starbucks
Bot: ✅ Saved: coffee - $5.50 at Starbucks (food)
```

Get summary:
```
You: summary
Bot: 📊 *Summary*
     💰 Total spent: $25.50
     📝 Transactions: 3
     *Categories:*
     • food: $20.50 (2)
     • transport: $5.00 (1)
```

## Testing the Webhook

You can test the webhook directly with `curl` without needing WhatsApp:

### Test Add Transaction
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "from": "5511999999999",
        "text": {
          "body": "bought lunch for $12.50 at Panera"
        }
      }
    ]
  }'
```

### Test Summary Command
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "from": "5511999999999",
        "text": {
          "body": "summary"
        }
      }
    ]
  }'
```

### Test History Command
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "from": "5511999999999",
        "text": {
          "body": "history"
        }
      }
    ]
  }'
```

### Test Clear Command
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "from": "5511999999999",
        "text": {
          "body": "clear"
        }
      }
    ]
  }'
```

## Project Structure

```
chatbot-exercise/
├── data/
│   └── finance.db              # SQLite database (gitignored)
├── dist/                       # Build output
├── drizzle/
│   ├── 0000_organic_eternals.sql  # Database migration
│   └── meta/
│       ├── 0000_snapshot.json
│       └── _journal.json
├── node_modules/
├── scripts/
│   ├── test-add.ts             # Add transaction test
│   ├── test-e2e.ts             # End-to-end test suite
│   ├── test-summary.ts         # Summary test
│   └── .env                    # Test environment (gitignored)
├── src/
│   ├── ai/                     # AI integration
│   │   ├── config.ts           # AI configuration
│   │   ├── index.ts            # AI module exports
│   │   ├── parser.ts           # Transaction parsing logic
│   │   └── prompts.ts         # AI prompts
│   ├── db/                     # Database layer
│   │   ├── client.ts           # Database client
│   │   ├── config.ts           # Database configuration
│   │   ├── index.ts            # Database module exports
│   │   └── transaction/
│   │       ├── index.ts        # Transaction model
│   │       └── schema.ts       # Transaction schema
│   ├── finance/                # Finance business logic
│   │   ├── commands/           # Command pattern implementation
│   │   │   ├── ClearCommand.ts
│   │   │   ├── Command.ts      # Base command interface
│   │   │   ├── CommandRegistry.ts
│   │   │   ├── HelpCommand.ts
│   │   │   ├── HistoryCommand.ts
│   │   │   ├── SummaryCommand.ts
│   │   │   └── TransactionCommand.ts
│   │   ├── controller.ts       # Request controller
│   │   ├── schemas.ts          # Finance-related schemas
│   │   └── service.ts          # Business logic service
│   ├── routes/
│   │   └── webhook.ts          # Webhook route handler
│   ├── types/
│   │   └── transaction.ts      # TypeScript types
│   ├── utils/
│   │   └── validation.ts       # Validation utilities
│   ├── whatsapp/
│   │   └── service.ts          # WhatsApp API service
│   ├── index.test.ts           # Unit tests
│   └── index.ts                # Application entry point
├── .env                        # Environment variables (gitignored)
├── .env.example                # Example env file
├── .gitignore
├── LICENSE
├── bun.lockb
├── drizzle.config.ts           # Drizzle configuration
├── package.json
├── README.md
└── tsconfig.json
```

## Architecture Overview

The application follows a layered architecture:

- **Routes Layer** (`src/routes/`) - Handles HTTP requests and routing
- **Controller Layer** (`src/finance/controller.ts`) - Manages request/response flow
- **Service Layer** (`src/finance/service.ts`) - Contains business logic
- **Command Pattern** (`src/finance/commands/`) - Encapsulates user commands
- **AI Layer** (`src/ai/`) - Handles AI-powered transaction parsing
- **Database Layer** (`src/db/`) - Manages data persistence with Drizzle ORM
- **External Services** (`src/whatsapp/`) - Integrates with WhatsApp API

## 360dialog Sandbox API

- Base URL: `https://waba-sandbox.360dialog.io/`
- Max 200 messages
- Messages can only be sent to your own phone number
- 3 predefined templates available

### Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/v1/configs/webhook` | POST | Set webhook URL |
| `/v1/messages` | POST | Send messages |

## Tech Stack

- **Hono** - Fast web framework
- **Bun** - JavaScript runtime
- **Drizzle ORM** - Type-safe database toolkit
- **Replicate** - AI model hosting (OpenAI o4-mini)
- **Zod** - TypeScript-first schema validation
- **TypeScript** - Type safety
- **360dialog** - WhatsApp Business API

## License

MIT
