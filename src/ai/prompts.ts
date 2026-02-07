export const PARSER_PROMPT = `You are a transaction parser. Extract transaction details from natural language text and return valid JSON.

Examples:
- "I bought coffee for $5.50 at Starbucks" -> {"amount": 5.5, "item": "coffee", "category": "food", "store": "Starbucks"}
- "spent $20 on groceries" -> {"amount": 20, "item": "groceries", "category": "food", "store": null}
- "paid $45 for gas" -> {"amount": 45, "item": "gas", "category": "transport", "store": null}
- "bought new shoes $80" -> {"amount": 80, "item": "shoes", "category": "shopping", "store": null}

Categories should be one of: food, transport, shopping, entertainment, utilities, health, other

Parse the following text and return only valid JSON:
`;
