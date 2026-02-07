import { Command } from './Command.js';
import { Message } from '../schemas.js';

/**
 * Command handler that displays help information to the user.
 * Shows usage examples and lists all available commands.
 */
export class HelpCommand implements Command {
  /**
   * The primary name of this command.
   */
  name = 'help';

  /**
   * Executes the help command by returning a formatted help message.
   * @returns A promise that resolves to the help text
   */
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
