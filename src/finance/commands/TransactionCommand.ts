import { Command } from './Command.js';
import { Message } from '../schemas.js';
import { parseTransaction } from '../../ai/index.js';
import type { NewTransaction } from '../../db/index.js';
import { z } from 'zod';
import { TransactionModel } from '../../db/index.js';

const ParsedTransactionSchema = z.object({
  amount: z.number().positive(),
  item: z.string().min(1),
  category: z.string().min(1),
  store: z.string().optional()
});

/** Parses natural language transactions using AI and stores them */
export class TransactionCommand implements Command {
  name = 'transaction';

  async execute(message: Message): Promise<string> {
    const text = message.text || '';

    const parsed = await parseTransaction(text);

    if (!parsed) {
      return '❌ Could not parse transaction. Try: "bought coffee for $5" or type "help"';
    }

    const validationResult = ParsedTransactionSchema.safeParse(parsed);

    if (!validationResult.success) {
      console.error('Invalid parsed transaction:', validationResult.error);
      return '❌ Invalid transaction data. Please try again.';
    }

    const validatedTransaction = validationResult.data;

    const transaction: NewTransaction = {
      phone_number: message.from,
      amount: validatedTransaction.amount,
      item: validatedTransaction.item,
      category: validatedTransaction.category,
      store: validatedTransaction.store
    };

    await TransactionModel.add(transaction);

    let response = `✅ Saved: ${validatedTransaction.item} - $${validatedTransaction.amount.toFixed(2)}`;
    if (validatedTransaction.store) {
      response += ` at ${validatedTransaction.store}`;
    }
    response += ` (${validatedTransaction.category})`;

    return response;
  }
}
