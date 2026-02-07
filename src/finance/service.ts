import { Message, parseCommand } from './schemas.js';
import { commandRegistry } from './commands/CommandRegistry.js';

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

    return await commandRegistry.getTransactionCommand().execute(message);
  }
}
