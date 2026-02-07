import { db } from "../client.js";
import { transactions } from "./schema.js";
import type { NewTransaction } from "./schema.js";
import { desc, eq, sql } from "drizzle-orm";

export { transactions };

/**
 * Model class that provides static methods for interacting with the transactions table.
 * Encapsulates all database operations related to financial transactions.
 */
export class TransactionModel {
  /**
   * Adds a new transaction to the database.
   * @param transaction - The transaction data to insert
   * @returns A promise that resolves to the created transaction with its ID
   */
  static async add(transaction: NewTransaction) {
    const result = await db.insert(transactions).values(transaction).returning();
    return result[0];
  }

  /**
   * Retrieves multiple transactions for a specific phone number.
   * Results are ordered by creation date in descending order (most recent first).
   * @param phoneNumber - The user's phone number to filter transactions
   * @param limit - Maximum number of transactions to return (default: 50)
   * @returns A promise that resolves to an array of transactions
   */
  static async getMany(phoneNumber: string, limit: number = 50) {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.phone_number, phoneNumber))
      .orderBy(desc(transactions.created_at))
      .limit(limit);
  }

  /**
   * Retrieves a spending summary for a specific phone number.
   * Includes total amount spent, transaction count, and breakdown by category.
   * @param phoneNumber - The user's phone number to summarize transactions for
   * @returns A promise that resolves to a summary object with totals and category data
   */
  static async getSummary(phoneNumber: string) {
    // Query total spending and transaction count
    const result = await db
      .select({
        total_spent: sql<number>`SUM(${transactions.amount})`,
        transactions_count: sql<number>`COUNT(*)`,
      })
      .from(transactions)
      .where(eq(transactions.phone_number, phoneNumber));

    const summary = result[0];

    // Query category breakdown with totals and counts
    const categories = await db
      .select({
        category: transactions.category,
        total: sql<number>`SUM(${transactions.amount})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(transactions)
      .where(eq(transactions.phone_number, phoneNumber))
      .groupBy(transactions.category)
      .orderBy(sql`SUM(${transactions.amount}) DESC`);

    return {
      total_spent: summary?.total_spent || 0,
      transactions_count: summary?.transactions_count || 0,
      categories,
    };
  }

  /**
   * Deletes all transactions for a specific phone number.
   * @param phoneNumber - The user's phone number to delete transactions for
   * @returns A promise that resolves when the deletion completes
   */
  static async clear(phoneNumber: string) {
    await db.delete(transactions).where(eq(transactions.phone_number, phoneNumber));
  }
}
