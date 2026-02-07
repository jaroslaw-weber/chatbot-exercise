import { Database } from "bun:sqlite";

const db = new Database("./data/finance.db", { create: true });
db.run(`
  CREATE TABLE IF NOT EXISTS transactions (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    phone_number text NOT NULL,
    amount real NOT NULL,
    item text NOT NULL,
    category text NOT NULL,
    store text,
    created_at integer NOT NULL
  )
`);
console.log("✅ Migration applied");
db.close();
