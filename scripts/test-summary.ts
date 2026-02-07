import Database from 'better-sqlite3';
import { getDatabase, getSummary, getTransactions } from '../src/db/sqlite.js';

const TEST_PHONE = '5511999999999';

async function runTest() {
  console.log('🧪 Test: Viewing Summary\n');

  const db = getDatabase();
  
  console.log('📋 Recent Transactions (last 10):\n');
  const transactions = getTransactions(db, TEST_PHONE, 10);
  
  if (transactions.length === 0) {
    console.log('  No transactions found.');
    console.log('  Run "bun run test:add" to add some transactions first.\n');
  } else {
    transactions.forEach((t, i) => {
      const date = new Date(t.created_at).toLocaleDateString();
      console.log(`  ${i + 1}. ${t.item}`);
      console.log(`     $${t.amount.toFixed(2)} - ${t.category}`);
      if (t.store) console.log(`     @ ${t.store}`);
      console.log(`     ${date}\n`);
    });
  }
  
  console.log('📊 Summary:\n');
  const summary = getSummary(db, TEST_PHONE);
  
  console.log(`  Total spent: $${summary.total_spent.toFixed(2)}`);
  console.log(`  Transactions: ${summary.transactions_count}\n`);
  
  if (summary.categories.length > 0) {
    console.log('  Category breakdown:');
    summary.categories.forEach(cat => {
      console.log(`    • ${cat.category}: $${cat.total.toFixed(2)} (${cat.count})`);
    });
  } else if (transactions.length > 0) {
    console.log('  No category data available');
  }
  
  db.close();
  
  console.log('\n✅ Summary retrieved successfully!');
  console.log('\n💡 Run "bun run test:add <message>" to add a new transaction');
}

runTest().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
