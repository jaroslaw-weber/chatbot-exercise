import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./transaction/schema.js";
import { dbPath } from "./config.js";

const sqlite = new Database(dbPath);

/** Drizzle ORM database instance */
export const db = drizzle(sqlite, { schema });
