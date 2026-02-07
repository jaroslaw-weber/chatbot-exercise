# Routes Module

This module defines all HTTP routes for the application.

## Purpose

Maps HTTP endpoints to their respective handlers and initializes the application services.

## Components

### `webhook.ts`
- Webhook route handler for WhatsApp messages
- POST endpoint at `/webhook`
- Integrates FinanceController, FinanceService, and WhatsAppService
- Handles incoming message events from 360dialog WhatsApp API

## Routes

| Method | Path | Description |
|--------|------|-------------|
| POST | /webhook | Receives WhatsApp message events |

## Webhook Flow

1. WhatsApp sends POST request to /webhook
2. Hono router receives request
3. FinanceController.handleWebhook() is called
4. Message is validated and processed
5. Response is sent back to WhatsApp via WhatsAppService

## Request Format

Webhook expects JSON body:

```json
{
  "messages": [
    {
      "from": "5511999999999",
      "text": {
        "body": "bought coffee for $5"
      }
    }
  ]
}
```

## Response Format

```json
{
  "status": "processed",
  "response": "✅ Saved: coffee - $5.00 (food)"
}
```

## Error Responses

- 400: Invalid request body
- 500: Internal server error

## Dependencies

- Hono - Web framework
- FinanceService - Business logic
- FinanceController - Request handling
- WhatsAppService - Message sending
