/**
 * Migration: Remove Shopify Dependencies
 * 
 * This script removes Shopify-specific columns from the database.
 * Run after deploying the Shopify-free codebase.
 * 
 * Usage:
 *   npx tsx scripts/migrate-remove-shopify.ts
 */

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('🔧 Starting Shopify removal migration...\n');

    // Check if columns exist before dropping
    const checkColumn = async (table: string, column: string): Promise<boolean> => {
      const result = await client.query(
        `SELECT 1 FROM information_schema.columns 
         WHERE table_name = $1 AND column_name = $2`,
        [table, column]
      );
      return result.rowCount > 0;
    };

    // Drop shopify_order_id from orders
    if (await checkColumn('orders', 'shopify_order_id')) {
      await client.query('ALTER TABLE orders DROP COLUMN shopify_order_id');
      console.log('✅ Dropped shopify_order_id from orders');
    } else {
      console.log('ℹ️  shopify_order_id not found in orders (already removed)');
    }

    // Drop shopify_order_id from batch_records
    if (await checkColumn('batch_records', 'shopify_order_id')) {
      await client.query('ALTER TABLE batch_records DROP COLUMN shopify_order_id');
      console.log('✅ Dropped shopify_order_id from batch_records');
    } else {
      console.log('ℹ️  shopify_order_id not found in batch_records (already removed)');
    }

    // Backfill status_history if missing
    const ordersWithoutHistory = await client.query(
      `SELECT id FROM orders WHERE status_history IS NULL OR jsonb_array_length(status_history::jsonb) = 0`
    );

    for (const row of ordersWithoutHistory.rows) {
      await client.query(
        `UPDATE orders 
         SET status_history = jsonb_build_array(jsonb_build_object('status', status, 'timestamp', created_at::text))
         WHERE id = $1`,
        [row.id]
      );
    }

    if (ordersWithoutHistory.rowCount > 0) {
      console.log(`✅ Backfilled status_history for ${ordersWithoutHistory.rowCount} orders`);
    }

    console.log('\n🎉 Migration complete! Shopify dependencies removed from database.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
