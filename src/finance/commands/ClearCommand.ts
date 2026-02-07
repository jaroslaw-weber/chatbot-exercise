import { Command } from './Command.js';
import { Message } from '../schemas.js';
import { TransactionModel } from '../../db/index.js';

export class ClearCommand implements Command {
  name = 'clear';

  async execute(message: Message): Promise<string> {
    await TransactionModel.clear(message.from);
    return '🗑️ All transactions cleared';
  }
}
