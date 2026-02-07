import { Command } from './Command.js';
import { Message } from '../schemas.js';
import { TransactionModel } from '../../db/index.js';

/**
 * Command handler that clears all transactions for a user.
 * Deletes all transactions associated with the user's phone number.
 */
export class ClearCommand implements Command {
  /**
   * The primary name of this command.
   */
  name = 'clear';

  /**
   * Executes the clear command by deleting all transactions for the user.
   * @param message - The message containing the user's phone number
   * @returns A promise that resolves to a confirmation message
   */
  async execute(message: Message): Promise<string> {
    await TransactionModel.clear(message.from);
    return '🗑️ All transactions cleared';
  }
}
