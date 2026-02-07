import { Command } from './Command.js';
import { Message } from '../schemas.js';
import { parseTransaction } from '../../ai/index.js';
import type { NewTransaction } from '../../db/index.js';
import { z } from 'zod';
import { TransactionModel } from '../../db/index.js';

/**
 * Zod schema for validating parsed transaction data from the AI parser.
 * Ensures required fields are present and properly formatted.
 */
const ParsedTransactionSchema = z.object({
  amount: z.number().positive(),
  item: z.string().min(1),
  category: z.string().min(1),
  store: z.string().optional()
});

/**
 * Command handler for processing transaction messages.
 * Uses AI to parse natural language transaction descriptions and stores them in the database.
 */
export class TransactionCommand implements Command {
  /**
   * The primary name of this command.
   */
  name = 'transaction';

  /**
   * Executes the transaction command by parsing the message text and saving the transaction.
   * @param message - The message containing the transaction description
   * @returns A promise that resolves to a confirmation message with transaction details
   */
  async execute(message: Message): Promise<string> {
    const text = message.text || '';

    // Use AI to parse the transaction from natural language
    const parsed = await parseTransaction(text);

    if (!parsed) {
      return '❌ Could not parse transaction. Try: "bought coffee for $5" or type "help"';
    }

    // Validate the parsed transaction data
    const validationResult = ParsedTransactionSchema.safeParse(parsed);

    if (!validationResult.success) {
      console.error('Invalid parsed transaction:', validationResult.error);
      return '❌ Invalid transaction data. Please try again.';
    }

    const validatedTransaction = validationResult.data;

    // Create the transaction object for database insertion
    const transaction: NewTransaction = {
      phone_number: message.from,
      amount: validatedTransaction.amount,
      item: validatedTransaction.item,
      category: validatedTransaction.category,
      store: validatedTransaction.store
    };

    // Save the transaction to the database
    await TransactionModel.add(transaction);

    // Build the confirmation response
    let response = `✅ Saved: ${validatedTransaction.item} - $${validatedTransaction.amount.toFixed(2)}`;
    if (validatedTransaction.store) {
      response += ` at ${validatedTransaction.store}`;
    }
    response += ` (${validatedTransaction.category})`;

    return response;
  }
}
