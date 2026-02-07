import { Command } from './Command.js';
import { SummaryCommand } from './SummaryCommand.js';
import { HistoryCommand } from './HistoryCommand.js';
import { ClearCommand } from './ClearCommand.js';
import { HelpCommand } from './HelpCommand.js';
import { TransactionCommand } from './TransactionCommand.js';

/**
 * Registry class that manages all available commands.
 * Provides functionality to register commands and retrieve them by name.
 */
class CommandRegistry {
  /**
   * Map storing all registered commands, indexed by their name and aliases.
   */
  private commands: Map<string, Command> = new Map();

  /**
   * Creates a new CommandRegistry and registers all available commands.
   */
  constructor() {
    this.register(new SummaryCommand());
    this.register(new HistoryCommand());
    this.register(new ClearCommand());
    this.register(new HelpCommand());
    this.register(new TransactionCommand());
  }

  /**
   * Registers a command and its aliases in the registry.
   * @param command - The command instance to register
   */
  private register(command: Command): void {
    // Register the primary command name
    this.commands.set(command.name, command);

    // Register all aliases pointing to the same command instance
    if (command.aliases) {
      for (const alias of command.aliases) {
        this.commands.set(alias, command);
      }
    }
  }

  /**
   * Retrieves a command by its name or alias.
   * @param commandName - The name or alias of the command to retrieve
   * @returns The command if found, undefined otherwise
   */
  get(commandName: string): Command | undefined {
    return this.commands.get(commandName);
  }

  /**
   * Gets the transaction command instance.
   * This is the default command used when no specific command is matched.
   * @returns The TransactionCommand instance
   */
  getTransactionCommand(): Command {
    return this.commands.get('transaction')!;
  }
}

/**
 * Singleton instance of the CommandRegistry containing all registered commands.
 */
export const commandRegistry = new CommandRegistry();
