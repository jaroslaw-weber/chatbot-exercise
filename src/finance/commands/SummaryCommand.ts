import { Command } from './Command.js';
import { Message } from '../schemas.js';
import { TransactionModel } from '../../db/index.js';

export class SummaryCommand implements Command {
  name = 'summary';
  aliases = ['total'];

  async execute(message: Message): Promise<string> {
    const summary = await TransactionModel.getSummary(message.from);
    return this.formatSummary(summary);
  }

  private formatSummary(summary: any): string {
    if (summary.transactions_count === 0) {
      return '📊 No transactions yet. Start by adding one!';
    }

    let response = `📊 *Summary*\n\n`;
    response += `💰 Total spent: $${summary.total_spent.toFixed(2)}\n`;
    response += `📝 Transactions: ${summary.transactions_count}\n\n`;

    if (summary.categories.length > 0) {
      response += `*Categories:*\n`;
      for (const cat of summary.categories) {
        response += `• ${cat.category}: $${cat.total.toFixed(2)} (${cat.count})\n`;
      }
    }

    return response;
  }
}
