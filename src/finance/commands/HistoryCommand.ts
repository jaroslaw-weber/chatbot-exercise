import { Command } from './Command.js';
import { Message } from '../schemas.js';
import { TransactionModel } from '../../db/index.js';

/**
 * Command handler that displays the user's recent transaction history.
 * Shows the most recent transactions in reverse chronological order.
 */
export class HistoryCommand implements Command {
  /**
   * The primary name of this command.
   */
  name = 'history';

  /**
   * Alternative names that can be used to invoke this command.
   */
  aliases = ['list'];

  /**
   * Executes the history command by retrieving and formatting recent transactions.
   * @param message - The message containing the user's phone number
   * @returns A promise that resolves to a formatted transaction list
   */
  async execute(message: Message): Promise<string> {
    const transactions = await TransactionModel.getMany(message.from, 10);
    return this.formatTransactionList(transactions);
  }

  /**
   * Formats a list of transactions into a user-friendly string.
   * @param transactions - Array of transaction objects to format
   * @returns A formatted string with transaction details
   */
  private formatTransactionList(transactions: any[]): string {
    if (transactions.length === 0) {
      return '📋 No transactions yet';
    }

    let response = '📋 *Recent Transactions*\n\n';

    // Format each transaction with its details
    for (const t of transactions) {
      const date = new Date(t.created_at).toLocaleDateString();
      response += `• ${t.item} - $${t.amount.toFixed(2)} (${t.category})`;
      if (t.store) response += ` @ ${t.store}`;
      response += `\n  ${date}\n\n`;
    }

    return response;
  }
}
