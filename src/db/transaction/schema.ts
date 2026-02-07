import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";

/**
 * SQLite table schema for storing financial transactions.
 * Includes fields for user identification, transaction details, and timestamps.
 */
export const transactions = sqliteTable("transactions", {
  /**
   * Primary key ID, auto-incrementing.
   */
  id: integer("id").primaryKey({ autoIncrement: true }),

  /**
   * The user's phone number that the transaction belongs to.
   */
  phone_number: text("phone_number").notNull(),

  /**
   * The monetary amount of the transaction.
   */
  amount: real("amount").notNull(),

  /**
   * Description of the item or service purchased.
   */
  item: text("item").notNull(),

  /**
   * Category classification for the transaction (e.g., food, transport, entertainment).
   */
  category: text("category").notNull(),

  /**
   * Optional store or merchant name where the transaction occurred.
   */
  store: text("store"),

  /**
   * Timestamp when the transaction was created.
   * Automatically defaults to the current time if not specified.
   */
  created_at: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

/**
 * Type representing a transaction record as it exists in the database (includes all fields).
 */
export type Transaction = typeof transactions.$inferSelect;

/**
 * Type representing a new transaction to be inserted (excludes auto-generated fields like id).
 */
export type NewTransaction = typeof transactions.$inferInsert;
