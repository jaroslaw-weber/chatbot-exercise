import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./transaction/schema.js";
import { dbPath } from "./config.js";

const sqlite = new Database(dbPath);

/**
 * Drizzle ORM database instance configured with SQLite.
 * Provides a type-safe interface for database operations.
 */
export const db = drizzle(sqlite, { schema });
