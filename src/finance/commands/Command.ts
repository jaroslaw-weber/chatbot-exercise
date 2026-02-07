import { Message } from './schemas.js';

/**
 * Interface defining the contract for command handlers.
 * All commands must implement this interface to be registered and executed.
 */
export interface Command {
  /**
   * The primary name of the command.
   */
  name: string;

  /**
   * Optional array of alternative names that can be used to invoke the command.
   */
  aliases?: string[];

  /**
   * Executes the command with the given message context.
   * @param message - The message containing the command and user information
   * @returns A promise that resolves to the response text to send to the user
   */
  execute(message: Message): Promise<string>;
}
