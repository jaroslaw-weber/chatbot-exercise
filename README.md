# WhatsApp Finance Tracker Chatbot

A personal finance tracking chatbot built with Hono framework, Bun runtime, and 360dialog Sandbox API. Uses Replicate AI for natural language transaction parsing.

## Features

- 📝 **Add transactions** via natural language: "bought coffee for $5 at Starbucks"
- 📊 **View summaries** with category breakdown: "summary"
- 📋 **Transaction history**: "history"
- 🗑️ **Clear data**: "clear"
- 🤖 **AI-powered parsing** using Replicate (Llama 3)
- 💾 **SQLite database** for persistent storage
- 👤 **Multi-user support** - Each phone number has separate data

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

```env
D360_API_KEY=your_api_key_here
D360_PHONE_NUMBER=your_phone_number_here
REPLICATE_API_KEY=your_replicate_api_key_here
PORT=3000
```

## Development

```bash
bun run dev
```

Server runs on `http://localhost:3000`

## Testing

Run tests without starting the full server:

```bash
bun test
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

## Project Structure

```
chatbot-exercise/
├── src/
│   ├── index.ts              # Main Hono app
│   ├── db/
│   │   └── sqlite.ts        # SQLite operations
│   ├── lib/
│   │   └── replicate.ts      # Replicate AI integration
│   ├── routes/
│   │   └── webhook.ts       # Webhook handler
│   ├── types/
│   │   └── transaction.ts   # TypeScript interfaces
│   └── index.test.ts        # Tests
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
- **Bun** - JavaScript runtime
- **Replicate** - AI model hosting (Llama 3)
- **better-sqlite3** - SQLite database
- **TypeScript** - Type safety
- **360dialog** - WhatsApp Business API

### Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/v1/configs/webhook` | POST | Set webhook URL |
| `/v1/messages` | POST | Send messages |

## License

MIT
