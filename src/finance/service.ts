import { Message, parseCommand } from './schemas.js';
import { commandRegistry } from './commands/CommandRegistry.js';

/**
 * Service class that processes incoming messages and routes them to appropriate command handlers.
 * Determines whether a message is a command or a transaction and delegates accordingly.
 */
export class FinanceService {
  /**
   * Processes an incoming message from the user.
   * Parses the message text to identify commands or transaction data,
   * and routes to the appropriate handler.
   * @param message - The message object containing sender information and text content
   * @returns A promise that resolves to the response text to send back to the user
   */
  async processMessage(message: Message): Promise<string> {
    const text = message.text;

    // Return empty string if no text is provided
    if (!text) {
      return '';
    }

    // Try to parse the message as a command
    const command = parseCommand(text);

    // If it's a known command, execute it
    if (command) {
      const commandHandler = commandRegistry.get(command);
      if (commandHandler) {
        return await commandHandler.execute(message);
      }
    }

    // Otherwise, treat it as a transaction and execute the transaction command
    return await commandRegistry.getTransactionCommand().execute(message);
  }
}
