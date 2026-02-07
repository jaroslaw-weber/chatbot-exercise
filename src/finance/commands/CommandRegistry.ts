import { Command } from './Command.js';
import { SummaryCommand } from './SummaryCommand.js';
import { HistoryCommand } from './HistoryCommand.js';
import { ClearCommand } from './ClearCommand.js';
import { HelpCommand } from './HelpCommand.js';
import { TransactionCommand } from './TransactionCommand.js';

/** Registry managing all available commands */
class CommandRegistry {
  private commands: Map<string, Command> = new Map();

  constructor() {
    this.register(new SummaryCommand());
    this.register(new HistoryCommand());
    this.register(new ClearCommand());
    this.register(new HelpCommand());
    this.register(new TransactionCommand());
  }

  private register(command: Command): void {
    this.commands.set(command.name, command);

    if (command.aliases) {
      for (const alias of command.aliases) {
        this.commands.set(alias, command);
      }
    }
  }

  get(commandName: string): Command | undefined {
    return this.commands.get(commandName);
  }

  getTransactionCommand(): Command {
    return this.commands.get('transaction')!;
  }
}

export const commandRegistry = new CommandRegistry();
