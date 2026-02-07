export { db } from "./client.js";
export { transactions } from "./schema.js";
export type { Transaction, NewTransaction } from "./schema.js";
export { addTransaction, getTransactions, getSummary, clearTransactions } from "./queries.js";
export { dbPath } from "./config.js";

import { db } from "./client.js";

export function getDatabase() {
  return db;
}
