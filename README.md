# WhatsApp Finance Tracker Chatbot

A personal finance tracking chatbot built with Hono framework, Bun runtime, and 360dialog Sandbox API. Uses Replicate AI for natural language transaction parsing.

## Features

- 📝 **Add transactions** via natural language: "bought coffee for $5 at Starbucks"
- 📊 **View summaries** with category breakdown: "summary"
- 📋 **Transaction history**: "history"
- 🗑️ **Clear data**: "clear"
- 🤖 **AI-powered parsing** using Replicate (Llama 3)
- 💾 **SQLite database** for persistent storage (using Bun's built-in `bun:sqlite`)
- 👤 **Multi-user support** - Each phone number has separate data

## Database

The application uses **bun:sqlite** for persistent data storage:

- **Location**: `./data/finance.db`
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

- Node.js 18.14.1+ or Bun 1.0.0+
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

Edit `.env` and add your credentials:

## Development

```bash
bun run dev
```

Server runs on `http://localhost:3000`

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
├── src/
│   ├── index.ts              # Main Hono app
│   ├── db/
│   │   └── sqlite.ts        # SQLite operations (using bun:sqlite)
│   ├── lib/
│   │   └── replicate.ts      # Replicate AI integration
│   ├── routes/
│   │   └── webhook.ts       # Webhook handler
│   ├── types/
│   │   └── transaction.ts   # TypeScript interfaces
│   └── index.test.ts        # Unit tests
├── scripts/
│   ├── test-add.ts          # Add transaction test
│   ├── test-summary.ts      # Summary test
│   └── test-e2e.ts          # End-to-end test suite
├── data/
│   └── finance.db           # SQLite database (gitignored)
├── .env                    # Environment variables (gitignored)
├── .env.example            # Example env file
└── package.json
```

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
- **Bun** - JavaScript runtime with built-in SQLite support
- **Replicate** - AI model hosting (Llama 3)
- **bun:sqlite** - Native SQLite database (Bun's built-in module)
- **TypeScript** - Type safety
- **360dialog** - WhatsApp Business API

## License

MIT
