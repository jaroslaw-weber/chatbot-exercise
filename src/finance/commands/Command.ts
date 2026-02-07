import { Message } from './schemas.js';

export interface Command {
  name: string;
  aliases?: string[];
  execute(message: Message): Promise<string>;
}
