const envPath = ".env";
console.log("Loading .env from:", envPath);

import {
  addTransaction,
  getTransactions,
} from "../src/db/index.js";
import { parseTransaction } from "../src/ai/index.js";

const TEST_PHONE = "5511999999999";

async function runTest() {
  console.log("🧪 Test: Adding Transaction\n");

  const testMessage =
    process.argv[2] || "I bought coffee for $5.50 at Starbucks";

  console.log(`Input: "${testMessage}"\n`);

  console.log("🤖 Parsing with Replicate AI...");
  const parsed = await parseTransaction(testMessage);

  if (!parsed) {
    console.log("❌ Failed to parse transaction");
    process.exit(1);
  }

  console.log(`✅ Parsed: ${JSON.stringify(parsed, null, 2)}\n`);

  const transaction = {
    phone_number: TEST_PHONE,
    amount: parsed.amount,
    item: parsed.item,
    category: parsed.category,
    store: parsed.store,
  };

  const saved = await addTransaction(transaction);
  console.log(`💾 Saved to database`);
  console.log(`   Item: ${saved.item}`);
  console.log(`   Amount: $${saved.amount.toFixed(2)}`);
  console.log(`   Category: ${saved.category}`);
  if (saved.store) {
    console.log(`   Store: ${saved.store}`);
  }

  console.log("\n✅ Transaction added successfully!");
  console.log('\n💡 Run "bun run test:summary" to view summary');
}

runTest().catch((error) => {
  console.error("❌ Test failed:", error);
  process.exit(1);
});
