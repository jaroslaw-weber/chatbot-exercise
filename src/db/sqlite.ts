import { Database } from 'bun:sqlite';
import { Transaction, Summary, CategorySummary } from '../types/transaction.js';

const dbPath = './data/finance.db';

export function getDatabase(): Database {
  const db = new Database(dbPath, { create: true });
  
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone_number TEXT NOT NULL,
      amount REAL NOT NULL,
      item TEXT NOT NULL,
      category TEXT NOT NULL,
      store TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  return db;
}

export function addTransaction(db: Database, transaction: Transaction): Transaction {
  const stmt = db.query(`
    INSERT INTO transactions (phone_number, amount, item, category, store)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    transaction.phone_number,
    transaction.amount,
    transaction.item,
    transaction.category,
    transaction.store || null
  );
  
  return { ...transaction, id: result.lastInsertRowid as number };
}

export function getTransactions(db: Database, phoneNumber: string, limit: number = 50): Transaction[] {
  const stmt = db.query(`
    SELECT * FROM transactions
    WHERE phone_number = ?
    ORDER BY created_at DESC
    LIMIT ?
  `);
  
  return stmt.all(phoneNumber, limit) as Transaction[];
}

export function getSummary(db: Database, phoneNumber: string): Summary {
  const totalStmt = db.query(`
    SELECT SUM(amount) as total, COUNT(*) as count
    FROM transactions
    WHERE phone_number = ?
  `);
  
  const totalResult = totalStmt.get(phoneNumber) as { total: number; count: number };
  
  const categoryStmt = db.query(`
    SELECT category, SUM(amount) as total, COUNT(*) as count
    FROM transactions
    WHERE phone_number = ?
    GROUP BY category
    ORDER BY total DESC
  `);
  
  const categories = categoryStmt.all(phoneNumber) as CategorySummary[];
  
  return {
    total_spent: totalResult.total || 0,
    transactions_count: totalResult.count || 0,
    categories
  };
}

export function clearTransactions(db: Database, phoneNumber: string): void {
  const stmt = db.query('DELETE FROM transactions WHERE phone_number = ?');
  stmt.run(phoneNumber);
}
