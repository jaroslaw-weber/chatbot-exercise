# AI Module

This module handles all AI-powered transaction parsing functionality using Replicate API.

## Purpose

Provides intelligent natural language processing to extract transaction details from user messages in plain English format.

## Components

### `config.ts`
- Manages Replicate API token configuration
- Validates token presence and format
- Exports the token for use in API requests

### `parser.ts`
- Main parser function that calls Replicate API
- Processes natural language input
- Extracts structured transaction data (amount, item, category, store)
- Handles error cases and invalid responses
- Returns parsed transaction or null on failure

### `prompts.ts`
- Defines the system prompt for AI model
- Specifies expected output format (JSON)
- Provides examples for the AI to follow
- Lists valid categories for transactions

### `index.ts`
- Module exports
- Re-exports all public functions and types

## How It Works

1. User sends natural language message (e.g., "bought coffee for $5 at Starbucks")
2. `parseTransaction()` function is called with the message text
3. Function sends request to Replicate API with OpenAI o4-mini model
4. AI model processes text and returns JSON with transaction details
5. Parser validates response and extracts required fields
6. Returns structured transaction object for database storage

## Categories

The AI recognizes these categories:
- food
- transport
- shopping
- entertainment
- utilities
- health
- other

## API Used

- **Provider**: Replicate
- **Model**: openai/o4-mini
- **Endpoint**: https://api.replicate.com/v1/models/openai/o4-mini/predictions

## Error Handling

- Validates API token is set correctly
- Handles API errors gracefully
- Returns null on parsing failure
- Logs errors for debugging
