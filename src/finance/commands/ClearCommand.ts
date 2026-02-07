import { Command } from './Command.js';
import { Message } from '../schemas.js';
import { TransactionModel } from '../../db/index.js';

/** Clears all transactions for a user */
export class ClearCommand implements Command {
  name = 'clear';

  async execute(message: Message): Promise<string> {
    await TransactionModel.clear(message.from);
    return '🗑️ All transactions cleared';
  }
}
