import { Command } from './Command.js';
import { Message } from '../schemas.js';

export class HelpCommand implements Command {
  name = 'help';

  async execute(): Promise<string> {
    return `📖 *Finance Tracker Help*\n\n` +
      `*Add transaction:*\n` +
      `  "bought coffee for $5 at Starbucks"\n` +
      `  "spent $20 on groceries"\n\n` +
      `*Commands:*\n` +
      `  "summary" - Show spending summary\n` +
      `  "history" - Show recent transactions\n` +
      `  "clear" - Clear all transactions\n` +
      `  "help" - Show this message`;
  }
}
