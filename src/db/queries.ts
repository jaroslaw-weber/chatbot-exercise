import { db } from "./client.js";
import { transactions } from "./schema.js";
import type { NewTransaction } from "./schema.js";
import { desc, eq, sql } from "drizzle-orm";

export async function addTransaction(transaction: NewTransaction) {
  const result = await db.insert(transactions).values(transaction).returning();
  return result[0];
}

export async function getTransactions(phoneNumber: string, limit: number = 50) {
  return await db
    .select()
    .from(transactions)
    .where(eq(transactions.phone_number, phoneNumber))
    .orderBy(desc(transactions.created_at))
    .limit(limit);
}

export async function getSummary(phoneNumber: string) {
  const result = await db
    .select({
      total_spent: sql<number>`SUM(${transactions.amount})`,
      transactions_count: sql<number>`COUNT(*)`,
    })
    .from(transactions)
    .where(eq(transactions.phone_number, phoneNumber));

  const summary = result[0];

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

export async function clearTransactions(phoneNumber: string) {
  await db.delete(transactions).where(eq(transactions.phone_number, phoneNumber));
}
