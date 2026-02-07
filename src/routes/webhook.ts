import { Hono } from 'hono';
import { getDatabase, addTransaction, getSummary, getTransactions, clearTransactions } from '../db/sqlite.js';
import { parseTransaction } from '../lib/replicate.js';
import { Transaction } from '../types/transaction.js';

const webhook = new Hono();

webhook.post('/', async (c) => {
  try {
    const body = await c.req.json();
    console.log('Received webhook:', JSON.stringify(body, null, 2));
    
    const message = body.messages?.[0];
    if (!message) {
      return c.json({ status: 'ok' });
    }
    
    const phoneNumber = message.from;
    const text = message.text?.body?.trim();
    
    if (!text) {
      return c.json({ status: 'ok' });
    }
    
    const db = getDatabase();
    let response = '';
    
    if (text.toLowerCase() === 'summary' || text.toLowerCase() === 'total') {
      const summary = getSummary(db, phoneNumber);
      response = formatSummary(summary);
    } else if (text.toLowerCase() === 'history' || text.toLowerCase() === 'list') {
      const transactions = getTransactions(db, phoneNumber, 10);
      response = formatTransactionList(transactions);
    } else if (text.toLowerCase() === 'clear') {
      clearTransactions(db, phoneNumber);
      response = '🗑️ All transactions cleared';
    } else if (text.toLowerCase() === 'help') {
      response = formatHelp();
    } else {
      const parsed = await parseTransaction(text);
      if (parsed) {
        const transaction: Transaction = {
          phone_number: phoneNumber,
          amount: parsed.amount,
          item: parsed.item,
          category: parsed.category,
          store: parsed.store
        };
        
        addTransaction(db, transaction);
        response = `✅ Saved: ${parsed.item} - $${parsed.amount.toFixed(2)}`;
        if (parsed.store) {
          response += ` at ${parsed.store}`;
        }
        response += ` (${parsed.category})`;
      } else {
        response = '❌ Could not parse transaction. Try: "bought coffee for $5" or type "help"';
      }
    }
    
    db.close();
    
    await sendWhatsAppMessage(phoneNumber, response);
    
    return c.json({ status: 'processed', response });
  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({ error: 'Internal error' }, 500);
  }
});

function formatSummary(summary: any): string {
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

function formatTransactionList(transactions: any[]): string {
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

function formatHelp(): string {
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

async function sendWhatsAppMessage(phoneNumber: string, text: string): Promise<void> {
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

export default webhook;
