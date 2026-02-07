import { Message, parseCommand } from './schemas.js';
import { commandRegistry } from './commands/CommandRegistry.js';

/** Processes messages and routes to appropriate command handlers */
export class FinanceService {
  async processMessage(message: Message): Promise<string> {
    const text = message.text;

    if (!text) {
      return '';
    }

    const command = parseCommand(text);

    if (command) {
      const commandHandler = commandRegistry.get(command);
      if (commandHandler) {
        return await commandHandler.execute(message);
      }
    }

    // Fallback to transaction command if no command found
    return await commandRegistry.getTransactionCommand().execute(message);
  }
}
