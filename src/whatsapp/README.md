# WhatsApp Module

This module handles all WhatsApp API integration using 360dialog.

## Purpose

Sends messages to WhatsApp users through the 360dialog API.

## Components

### `service.ts`
- WhatsAppService class
- sendMessage() method for sending text messages
- Handles API key configuration
- Error logging for failed sends

## How It Works

1. FinanceService generates a response message
2. WhatsAppService.sendMessage() is called with phone number and text
3. Service retrieves D360_API_KEY from environment
4. HTTP POST request is made to 360dialog API
5. Message is delivered to the user's WhatsApp

## API Used

- **Provider**: 360dialog WhatsApp Sandbox
- **Base URL**: https://waba-sandbox.360dialog.io/
- **Endpoint**: /v1/messages
- **Method**: POST

## Request Headers

```
Content-Type: application/json
D360-API-KEY: <your_api_key>
```

## Request Body

```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "5511999999999",
  "type": "text",
  "text": {
    "body": "Your message here"
  }
}
```

## Environment Variables

- `D360_API_KEY` - API key from 360dialog sandbox

## Error Handling

- Logs error if API key is not set
- Logs error if message send fails
- Does not throw exceptions (fails silently)

## Limitations (Sandbox)

- Messages can only be sent to your own phone number
- Maximum 200 messages
- Only supports text messages

## Example Usage

```typescript
import { WhatsAppService } from './whatsapp/service.js';

const service = new WhatsAppService();
await service.sendMessage('5511999999999', 'Hello from bot!');
```

## Setup

To get a D360 API key:
1. Text "START" to +551146733492 on WhatsApp
2. You'll receive an API key in response
3. Add it to your .env file
