import Replicate from 'replicate';
import { ParsedTransaction } from '../types/transaction.js';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

const PARSER_PROMPT = `You are a transaction parser. Extract transaction details from natural language text and return valid JSON.

Examples:
- "I bought coffee for $5.50 at Starbucks" -> {"amount": 5.5, "item": "coffee", "category": "food", "store": "Starbucks"}
- "spent $20 on groceries" -> {"amount": 20, "item": "groceries", "category": "food", "store": null}
- "paid $45 for gas" -> {"amount": 45, "item": "gas", "category": "transport", "store": null}
- "bought new shoes $80" -> {"amount": 80, "item": "shoes", "category": "shopping", "store": null}

Categories should be one of: food, transport, shopping, entertainment, utilities, health, other

Parse the following text and return only valid JSON:
`;

export async function parseTransaction(text: string): Promise<ParsedTransaction | null> {
  try {
    const output = await replicate.run(
      'meta/llama-3.1-8b-instruct',
      {
        input: {
          prompt: `${PARSER_PROMPT}\n\n${text}`,
          max_new_tokens: 200,
          temperature: 0.1
        }
      }
    );
    
    let response = typeof output === 'string' ? output : JSON.stringify(output);
    
    const jsonMatch = response.match(/\{[^}]+\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', response);
      return null;
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!parsed.amount || !parsed.item || !parsed.category) {
      console.error('Missing required fields in parsed transaction:', parsed);
      return null;
    }
    
    return {
      amount: Number(parsed.amount),
      item: parsed.item.trim(),
      category: parsed.category.trim().toLowerCase(),
      store: parsed.store?.trim() || null
    };
  } catch (error) {
    console.error('Error parsing transaction:', error);
    return null;
  }
}
