import { Command } from './Command.js';
import { Message } from '../schemas.js';
import { TransactionModel } from '../../db/index.js';

export class HistoryCommand implements Command {
  name = 'history';
  aliases = ['list'];

  async execute(message: Message): Promise<string> {
    const transactions = await TransactionModel.getMany(message.from, 10);
    return this.formatTransactionList(transactions);
  }

  private formatTransactionList(transactions: any[]): string {
    if (transactions.length === 0) {
      return '📋 No transactions yet';
    }

    let response = '📋 *Recent Transactions*\n\n';
    for (const t of transactions) {
      const date = new Date(t.created_at).toLocaleDateString();
      response += `• ${t.item} - $${t.amount.toFixed(2)} (${t.category})`;
      if (t.store) response += ` @ ${t.store}`;
      response += `\n  ${date}\n\n`;
    }

    return response;
  }
}
