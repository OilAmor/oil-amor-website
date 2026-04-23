/**
 * Safe Database Migration Script for Oil Amor Refill Program Tables
 * 
 * This script creates the missing refill program tables if they don't already exist.
 * It is IDEMPOTENT — safe to run multiple times.
 * 
 * Usage:
 *   npx tsx scripts/create-refill-tables.ts
 * 
 * Required env: DATABASE_URL
 */

import { Pool } from 'pg';

const CREATE_TABLES_SQL = `
-- ============================================================================
-- REFILL PROGRAM TABLES
-- ============================================================================

-- Bottle status enum
DO $$ BEGIN
  CREATE TYPE bottle_status AS ENUM ('active', 'empty', 'in-transit', 'refilled', 'retired');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Refill order status enum
DO $$ BEGIN
  CREATE TYPE refill_order_status AS ENUM ('pending-return', 'in-transit', 'received', 'inspecting', 'refilling', 'completed', 'cancelled', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Credit transaction type enum
DO $$ BEGIN
  CREATE TYPE credit_transaction_type AS ENUM ('earned', 'used', 'expired', 'adjusted');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Shipment status enum
DO $$ BEGIN
  CREATE TYPE shipment_status AS ENUM ('pending', 'in-transit', 'delivered', 'exception', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Order status enum
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'blending', 'quality-check', 'ready-to-ship', 'shipped', 'delivered', 'cancelled', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Payment status enum
DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'authorized', 'captured', 'failed', 'refunded', 'partially-refunded');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- FOREVER BOTTLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS forever_bottles (
  id text PRIMARY KEY,
  customer_id text NOT NULL,
  serial_number text NOT NULL UNIQUE,
  oil_type text NOT NULL,
  capacity text NOT NULL DEFAULT '100ml',
  purchase_date timestamp with time zone NOT NULL,
  status bottle_status NOT NULL DEFAULT 'active',
  current_fill_level integer NOT NULL DEFAULT 100,
  refill_count integer NOT NULL DEFAULT 0,
  last_refill_date timestamp with time zone,
  return_label jsonb,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS bottle_customer_id_idx ON forever_bottles (customer_id);
CREATE INDEX IF NOT EXISTS bottle_serial_number_idx ON forever_bottles (serial_number);
CREATE INDEX IF NOT EXISTS bottle_status_idx ON forever_bottles (status);

-- ============================================================================
-- FOREVER BOTTLE HISTORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS forever_bottle_history (
  id text PRIMARY KEY,
  bottle_id text NOT NULL REFERENCES forever_bottles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  timestamp timestamp with time zone NOT NULL DEFAULT NOW(),
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS history_bottle_id_idx ON forever_bottle_history (bottle_id);
CREATE INDEX IF NOT EXISTS history_event_type_idx ON forever_bottle_history (event_type);
CREATE INDEX IF NOT EXISTS history_timestamp_idx ON forever_bottle_history (timestamp);

-- ============================================================================
-- REFILL ORDERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS refill_orders (
  id text PRIMARY KEY,
  customer_id text NOT NULL,
  bottle_id text NOT NULL REFERENCES forever_bottles(id) ON DELETE CASCADE,
  oil_type text NOT NULL,
  status refill_order_status NOT NULL DEFAULT 'pending-return',
  return_label jsonb NOT NULL DEFAULT '{}',
  pricing jsonb NOT NULL DEFAULT '{}',
  inspection_result jsonb,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
  completed_at timestamp with time zone
);

CREATE INDEX IF NOT EXISTS order_customer_id_idx ON refill_orders (customer_id);
CREATE INDEX IF NOT EXISTS order_bottle_id_idx ON refill_orders (bottle_id);
CREATE INDEX IF NOT EXISTS order_status_idx ON refill_orders (status);
CREATE INDEX IF NOT EXISTS order_created_at_idx ON refill_orders (created_at);

-- ============================================================================
-- CUSTOMER CREDITS
-- ============================================================================
CREATE TABLE IF NOT EXISTS customer_credits (
  id text PRIMARY KEY,
  customer_id text NOT NULL UNIQUE,
  balance integer NOT NULL DEFAULT 0,
  total_earned integer NOT NULL DEFAULT 0,
  total_used integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS credit_customer_id_idx ON customer_credits (customer_id);

-- ============================================================================
-- CREDIT TRANSACTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS credit_transactions (
  id text PRIMARY KEY,
  customer_id text NOT NULL,
  type credit_transaction_type NOT NULL,
  amount integer NOT NULL,
  balance integer NOT NULL,
  description text NOT NULL,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  expires_at timestamp with time zone
);

CREATE INDEX IF NOT EXISTS transaction_customer_id_idx ON credit_transactions (customer_id);
CREATE INDEX IF NOT EXISTS transaction_type_idx ON credit_transactions (type);
CREATE INDEX IF NOT EXISTS transaction_created_at_idx ON credit_transactions (created_at);
CREATE INDEX IF NOT EXISTS transaction_expires_at_idx ON credit_transactions (expires_at);

-- ============================================================================
-- AUSTRALIA POST SHIPMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS auspost_shipments (
  id text PRIMARY KEY,
  bottle_id text NOT NULL REFERENCES forever_bottles(id) ON DELETE CASCADE,
  tracking_number text NOT NULL UNIQUE,
  shipment_id text NOT NULL,
  label_url text NOT NULL,
  status shipment_status NOT NULL DEFAULT 'pending',
  from_address jsonb NOT NULL,
  to_address jsonb NOT NULL,
  last_event jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  expires_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS shipment_bottle_id_idx ON auspost_shipments (bottle_id);
CREATE INDEX IF NOT EXISTS shipment_tracking_number_idx ON auspost_shipments (tracking_number);
CREATE INDEX IF NOT EXISTS shipment_status_idx ON auspost_shipments (status);

-- ============================================================================
-- INVENTORY ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS inventory_items (
  id text PRIMARY KEY,
  sku text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  reserved_quantity integer NOT NULL DEFAULT 0,
  reorder_point integer NOT NULL DEFAULT 0,
  metadata jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS inventory_sku_idx ON inventory_items (sku);
CREATE INDEX IF NOT EXISTS inventory_category_idx ON inventory_items (category);

-- ============================================================================
-- CUSTOMERS (if not exists)
-- ============================================================================
CREATE TABLE IF NOT EXISTS customers (
  id text PRIMARY KEY,
  email text NOT NULL UNIQUE,
  first_name text,
  last_name text,
  phone text,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS customer_email_idx ON customers (email);

-- ============================================================================
-- ORDERS (if not exists)
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  customer_id text NOT NULL REFERENCES customers(id),
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  is_guest boolean NOT NULL DEFAULT false,
  status order_status NOT NULL DEFAULT 'pending',
  status_history jsonb,
  items jsonb,
  subtotal integer NOT NULL DEFAULT 0,
  tax_total integer NOT NULL DEFAULT 0,
  shipping_total integer NOT NULL DEFAULT 0,
  discount_total integer NOT NULL DEFAULT 0,
  store_credit_used integer NOT NULL DEFAULT 0,
  gift_card_used integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'AUD',
  payment jsonb,
  shipping_address jsonb,
  shipping jsonb,
  is_gift boolean NOT NULL DEFAULT false,
  gift_message text,
  gift_receipt boolean NOT NULL DEFAULT false,
  requires_blending boolean NOT NULL DEFAULT false,
  blending_priority text,
  eligible_for_returns boolean NOT NULL DEFAULT false,
  return_credits_earned integer NOT NULL DEFAULT 0,
  return_credits_used integer NOT NULL DEFAULT 0,
  customer_note text,
  internal_note text,
  metadata jsonb,
  processing_completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS order_customer_idx ON orders (customer_id);
CREATE INDEX IF NOT EXISTS order_customer_email_idx ON orders (customer_email);
CREATE INDEX IF NOT EXISTS order_status_idx ON orders (status);
CREATE INDEX IF NOT EXISTS order_created_idx ON orders (created_at);

-- ============================================================================
-- AUDIT LOGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id text PRIMARY KEY,
  admin_id text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  before jsonb,
  after jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_entity_idx ON audit_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS audit_created_idx ON audit_logs (created_at);

-- ============================================================================
-- UNLOCKED OILS
-- ============================================================================
CREATE TABLE IF NOT EXISTS unlocked_oils (
  id text PRIMARY KEY,
  customer_id text NOT NULL,
  oil_id text NOT NULL,
  unlocked_at timestamp with time zone NOT NULL DEFAULT NOW(),
  unlocked_by text NOT NULL,
  type text NOT NULL DEFAULT 'pure',
  created_at timestamp with time zone NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS unlocked_oils_customer_idx ON unlocked_oils (customer_id);
CREATE INDEX IF NOT EXISTS unlocked_oils_oil_idx ON unlocked_oils (oil_id);
CREATE INDEX IF NOT EXISTS unlocked_oils_unique_idx ON unlocked_oils (customer_id, oil_id);
`;

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('ERROR: DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    console.log('Creating refill program tables (if not exists)...');
    await client.query(CREATE_TABLES_SQL);
    
    console.log('Checking existing tables...');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('forever_bottles', 'refill_orders', 'customer_credits', 'credit_transactions', 'auspost_shipments', 'inventory_items', 'orders', 'customers', 'audit_logs', 'unlocked_oils')
      ORDER BY table_name
    `);
    
    console.log('\nTables now present:');
    for (const row of result.rows) {
      console.log(`  ✓ ${row.table_name}`);
    }
    
    client.release();
    console.log('\n✅ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
