export { db } from "./client.js";
export { transactions, TransactionModel } from "./transaction/index.js";
export type { Transaction, NewTransaction } from "./transaction/schema.js";
export { dbPath } from "./config.js";
import { TransactionModel } from "./transaction/index.js";

/**
 * Adds a new transaction to the database.
 * @param transaction - The transaction data to insert
 * @returns A promise that resolves to the created transaction
 */
export async function addTransaction(transaction: import("./transaction/schema.js").NewTransaction) {
  return await TransactionModel.add(transaction);
}

/**
 * Retrieves transactions for a specific phone number.
 * @param phoneNumber - The user's phone number
 * @param limit - Optional limit on the number of transactions to return
 * @returns A promise that resolves to an array of transactions
 */
export async function getTransactions(phoneNumber: string, limit?: number) {
  return await TransactionModel.getMany(phoneNumber, limit);
}

/**
 * Retrieves a spending summary for a specific phone number.
 * @param phoneNumber - The user's phone number
 * @returns A promise that resolves to the summary object with totals and category breakdown
 */
export async function getSummary(phoneNumber: string) {
  return await TransactionModel.getSummary(phoneNumber);
}

/**
 * Clears all transactions for a specific phone number.
 * @param phoneNumber - The user's phone number
 * @returns A promise that resolves when the operation completes
 */
export async function clearTransactions(phoneNumber: string) {
  return await TransactionModel.clear(phoneNumber);
}
