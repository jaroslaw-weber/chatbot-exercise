# WhatsApp Chatbot with 360dialog API

A simple WhatsApp chatbot built with Hono framework and Bun runtime, using the 360dialog Sandbox API.

## Prerequisites

- Node.js 18.14.1+ or Bun 1.0.0+
- WhatsApp account to get API key

## Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Get API Key

Text "START" to `+551146733492` on WhatsApp. You'll receive an API key.

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
D360_API_KEY=your_api_key_here
D360_PHONE_NUMBER=your_phone_number_here
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

## Project Structure

```
chatbot-exercise/
├── src/
│   ├── index.ts          # Main Hono app and server
│   └── index.test.ts     # Tests
├── .env                  # Environment variables (not in git)
├── .env.example          # Example env file
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

## License

MIT
