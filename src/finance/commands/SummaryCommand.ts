import { Command } from './Command.js';
import { Message } from '../schemas.js';
import { TransactionModel } from '../../db/index.js';

/**
 * Command handler that displays a spending summary.
 * Shows total amount spent, transaction count, and breakdown by category.
 */
export class SummaryCommand implements Command {
  /**
   * The primary name of this command.
   */
  name = 'summary';

  /**
   * Alternative names that can be used to invoke this command.
   */
  aliases = ['total'];

  /**
   * Executes the summary command by retrieving and formatting spending data.
   * @param message - The message containing the user's phone number
   * @returns A promise that resolves to a formatted summary string
   */
  async execute(message: Message): Promise<string> {
    const summary = await TransactionModel.getSummary(message.from);
    return this.formatSummary(summary);
  }

  /**
   * Formats the summary data into a user-friendly string.
   * @param summary - The summary object containing spending statistics
   * @returns A formatted string with the summary information
   */
  private formatSummary(summary: any): string {
    if (summary.transactions_count === 0) {
      return '📊 No transactions yet. Start by adding one!';
    }

    let response = `📊 *Summary*\n\n`;
    response += `💰 Total spent: $${summary.total_spent.toFixed(2)}\n`;
    response += `📝 Transactions: ${summary.transactions_count}\n\n`;

    // Add category breakdown if categories exist
    if (summary.categories.length > 0) {
      response += `*Categories:*\n`;
      for (const cat of summary.categories) {
        response += `• ${cat.category}: $${cat.total.toFixed(2)} (${cat.count})\n`;
      }
    }

    return response;
  }
}
