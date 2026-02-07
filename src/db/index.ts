export { db } from "./client.js";
export { transactions, TransactionModel } from "./transaction/index.js";
export type { Transaction, NewTransaction } from "./transaction/schema.js";
export { dbPath } from "./config.js";
import { TransactionModel } from "./transaction/index.js";

export async function addTransaction(transaction: import("./transaction/schema.js").NewTransaction) {
  return await TransactionModel.add(transaction);
}

export async function getTransactions(phoneNumber: string, limit?: number) {
  return await TransactionModel.getMany(phoneNumber, limit);
}

export async function getSummary(phoneNumber: string) {
  return await TransactionModel.getSummary(phoneNumber);
}

export async function clearTransactions(phoneNumber: string) {
  return await TransactionModel.clear(phoneNumber);
}
