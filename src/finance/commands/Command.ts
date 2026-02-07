import { Message } from './schemas.js';

/** Interface for command handlers that can be registered and executed */
export interface Command {
  name: string;
  aliases?: string[];
  execute(message: Message): Promise<string>;
}
