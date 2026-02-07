import Database from 'better-sqlite3';
import { addTransaction, getSummary, getTransactions } from '../src/db/index.js';
import { parseTransaction } from '../src/ai/index.js';

const TEST_PHONE = '5511999999999';

async function runTest() {
  console.log('🧪 Running E2E Finance Tracker Test\n');

  const testMessages = [
    'I bought coffee for $5.50 at Starbucks',
    'spent $20 on groceries at Whole Foods',
    'paid $45 for gas',
    'bought new shoes for $80'
  ];

  console.log('📝 Test 1: Parsing transactions with Replicate AI...\n');
  const results = [];

  for (const msg of testMessages) {
    console.log(`Parsing: "${msg}"`);
    const parsed = await parseTransaction(msg);
    
    if (parsed) {
      console.log(`  ✅ Parsed: ${JSON.stringify(parsed, null, 2)}`);
      
      const transaction = {
        phone_number: TEST_PHONE,
        amount: parsed.amount,
        item: parsed.item,
        category: parsed.category,
        store: parsed.store
      };
      
      const saved = await addTransaction(transaction);
      console.log(`  💾 Saved to DB with ID: ${saved.id}\n`);
      results.push(saved);
    } else {
      console.log(`  ❌ Failed to parse\n`);
    }
  }

  console.log('\n📊 Test 2: Getting transactions from DB...\n');
  const transactions = await getTransactions(TEST_PHONE, 10);
  console.log(`Retrieved ${transactions.length} transactions:`);
  transactions.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t.item} - $${t.amount.toFixed(2)} (${t.category})`);
  });

  console.log('\n📈 Test 3: Getting summary...\n');
  const summary = await getSummary(TEST_PHONE);
  console.log(JSON.stringify(summary, null, 2));

  console.log('\n✅ All tests completed!\n');
  
  console.log('📋 Summary breakdown:');
  console.log(`  Total spent: $${summary.total_spent.toFixed(2)}`);
  console.log(`  Total transactions: ${summary.transactions_count}`);
  console.log(`  Categories found: ${summary.categories.length}`);
  summary.categories.forEach(cat => {
    console.log(`    • ${cat.category}: $${cat.total.toFixed(2)} (${cat.count} items)`);
  });
  
  console.log('\n💡 Tip: Run "clear" in WhatsApp to reset the database');
}

runTest().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
