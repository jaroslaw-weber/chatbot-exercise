import { getDatabase, addTransaction, getSummary, getTransactions, clearTransactions } from '../../db/sqlite.js';
import { parseTransaction } from '../../ai/index.js';
import { Transaction } from '../../types/transaction.js';
import { z } from 'zod';
import { Message } from './schemas.js';

const ParsedTransactionSchema = z.object({
  amount: z.number().positive(),
  item: z.string().min(1),
  category: z.string().min(1),
  store: z.string().optional()
});

export type ParsedTransaction = z.infer<typeof ParsedTransactionSchema>;

export class FinanceService {
  async processMessage(message: Message): Promise<string> {
    const phoneNumber = message.from;
    const text = message.text;
    
    if (!text) {
      return '';
    }
    
    const db = getDatabase();
    let response: string;
    
    const lowerText = text.toLowerCase();
    
    if (lowerText === 'summary' || lowerText === 'total') {
      const summary = getSummary(db, phoneNumber);
      response = this.formatSummary(summary);
    } else if (lowerText === 'history' || lowerText === 'list') {
      const transactions = getTransactions(db, phoneNumber, 10);
      response = this.formatTransactionList(transactions);
    } else if (lowerText === 'clear') {
      clearTransactions(db, phoneNumber);
      response = '🗑️ All transactions cleared';
    } else if (lowerText === 'help') {
      response = this.formatHelp();
    } else {
      response = await this.handleTransaction(text, phoneNumber, db);
    }
    
    db.close();
    
    return response;
  }
  
  private async handleTransaction(text: string, phoneNumber: string, db: any): Promise<string> {
    const parsed = await parseTransaction(text);
    
    if (!parsed) {
      return '❌ Could not parse transaction. Try: "bought coffee for $5" or type "help"';
    }
    
    const validationResult = ParsedTransactionSchema.safeParse(parsed);
    
    if (!validationResult.success) {
      console.error('Invalid parsed transaction:', validationResult.error);
      return '❌ Invalid transaction data. Please try again.';
    }
    
    const validatedTransaction = validationResult.data;
    
    const transaction: Transaction = {
      phone_number: phoneNumber,
      amount: validatedTransaction.amount,
      item: validatedTransaction.item,
      category: validatedTransaction.category,
      store: validatedTransaction.store
    };
    
    addTransaction(db, transaction);
    let response = `✅ Saved: ${validatedTransaction.item} - $${validatedTransaction.amount.toFixed(2)}`;
    if (validatedTransaction.store) {
      response += ` at ${validatedTransaction.store}`;
    }
    response += ` (${validatedTransaction.category})`;
    return response;
  }
  
  async sendWhatsAppMessage(phoneNumber: string, text: string): Promise<void> {
    const apiKey = process.env.D360_API_KEY;
    if (!apiKey) {
      console.error('D360_API_KEY not set');
      return;
    }
    
    const response = await fetch('https://waba-sandbox.360dialog.io/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'D360-API-KEY': apiKey
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneNumber,
        type: 'text',
        text: {
          body: text
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to send WhatsApp message:', error);
    }
  }
  
  private formatSummary(summary: any): string {
    if (summary.transactions_count === 0) {
      return '📊 No transactions yet. Start by adding one!';
    }
    
    let response = `📊 *Summary*\n\n`;
    response += `💰 Total spent: $${summary.total_spent.toFixed(2)}\n`;
    response += `📝 Transactions: ${summary.transactions_count}\n\n`;
    
    if (summary.categories.length > 0) {
      response += `*Categories:*\n`;
      for (const cat of summary.categories) {
        response += `• ${cat.category}: $${cat.total.toFixed(2)} (${cat.count})\n`;
      }
    }
    
    return response;
  }
  
  private formatTransactionList(transactions: any[]): string {
    if (transactions.length === 0) {
      return '📋 No transactions yet';
    }
    
    let response = '📋 *Recent Transactions*\n\n';
    for (const t of transactions) {
      const date = new Date(t.created_at).toLocaleDateString();
      response += `• ${t.item} - $${t.amount.toFixed(2)} (${t.category})`;
      if (t.store) response += ` @ ${t.store}`;
      response += `\n  ${date}\n\n`;
    }
    
    return response;
  }
  
  private formatHelp(): string {
    return `📖 *Finance Tracker Help*\n\n` +
      `*Add transaction:*\n` +
      `  "bought coffee for $5 at Starbucks"\n` +
      `  "spent $20 on groceries"\n\n` +
      `*Commands:*\n` +
      `  "summary" - Show spending summary\n` +
      `  "history" - Show recent transactions\n` +
      `  "clear" - Clear all transactions\n` +
      `  "help" - Show this message`;
  }
}
