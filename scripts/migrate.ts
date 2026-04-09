#!/usr/bin/env tsx
// =============================================================================
// Database Migration Runner
// =============================================================================
// Uses Drizzle ORM to run database migrations
// Supports: up, down, status, create commands
// =============================================================================

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { existsSync, readdirSync } from "fs";
import { join } from "path";
import { spawn } from "child_process";

// =============================================================================
// Configuration
// =============================================================================

const MIGRATIONS_FOLDER = join(process.cwd(), "scripts", "migrations");

// Database connection configuration
function getConnectionString(): string {
  const config = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME || "oil_amor",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
  };

  return `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
}

// =============================================================================
// CLI Helpers
// =============================================================================

function printHelp(): void {
  console.log(`
Database Migration Runner for Oil Amor

Usage:
  pnpm migrate [command] [options]

Commands:
  up          Run pending migrations
  down        Rollback last migration
  status      Show migration status
  create      Create a new migration file
  reset       Reset database (DANGER: drops all tables)

Options:
  --help      Show this help message

Examples:
  pnpm migrate up
  pnpm migrate down
  pnpm migrate create add_user_preferences
  pnpm migrate status
`);
}

function log(message: string, type: "info" | "success" | "error" | "warning" = "info"): void {
  const colors = {
    info: "\x1b[36m",    // Cyan
    success: "\x1b[32m", // Green
    error: "\x1b[31m",   // Red
    warning: "\x1b[33m", // Yellow
  };
  const reset = "\x1b[0m";
  
  console.log(`${colors[type]}[${type.toUpperCase()}]${reset} ${message}`);
}

// =============================================================================
// Migration Commands
// =============================================================================

async function migrateUp(): Promise<void> {
  log("Connecting to database...", "info");
  
  const pool = new Pool({
    connectionString: getConnectionString(),
  });

  const db = drizzle(pool);

  try {
    log("Running migrations...", "info");
    
    await migrate(db, {
      migrationsFolder: MIGRATIONS_FOLDER,
    });

    log("Migrations completed successfully!", "success");
  } catch (error) {
    log(`Migration failed: ${error instanceof Error ? error.message : "Unknown error"}`, "error");
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function migrateDown(): Promise<void> {
  log("Rollback functionality requires custom implementation", "warning");
  log("Consider using: pnpm drizzle-kit generate --custom", "info");
  
  // For now, show what would be rolled back
  const pool = new Pool({
    connectionString: getConnectionString(),
  });

  try {
    const result = await pool.query(`
      SELECT id, migration_name, created_at
      FROM drizzle.__drizzle_migrations
      ORDER BY created_at DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      log("No migrations to rollback", "warning");
      return;
    }

    const lastMigration = result.rows[0];
    log(`Last migration: ${lastMigration.migration_name}`, "info");
    log("To rollback, manually run the down migration SQL", "warning");
  } catch (error) {
    log(`Failed to get migration status: ${error instanceof Error ? error.message : "Unknown error"}`, "error");
  } finally {
    await pool.end();
  }
}

async function showStatus(): Promise<void> {
  const pool = new Pool({
    connectionString: getConnectionString(),
  });

  try {
    // Check if migrations table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'drizzle' 
        AND table_name = '__drizzle_migrations'
      )
    `);

    if (!tableCheck.rows[0].exists) {
      log("No migrations table found. Run 'pnpm migrate up' to initialize.", "warning");
      return;
    }

    // Get applied migrations
    const appliedResult = await pool.query(`
      SELECT migration_name, created_at
      FROM drizzle.__drizzle_migrations
      ORDER BY created_at DESC
    `);

    // Get available migrations
    const availableMigrations = existsSync(MIGRATIONS_FOLDER)
      ? readdirSync(MIGRATIONS_FOLDER)
          .filter(f => f.endsWith(".sql"))
          .sort()
      : [];

    const appliedNames = new Set(appliedResult.rows.map(r => r.migration_name));

    console.log("\n" + "=".repeat(60));
    console.log("MIGRATION STATUS");
    console.log("=".repeat(60) + "\n");

    console.log(`Applied: ${appliedResult.rows.length}`);
    console.log(`Available: ${availableMigrations.length}`);
    console.log(`Pending: ${availableMigrations.length - appliedResult.rows.length}\n`);

    if (appliedResult.rows.length > 0) {
      console.log("Applied migrations:");
      appliedResult.rows.forEach(row => {
        console.log(`  ✓ ${row.migration_name} (${new Date(row.created_at).toLocaleDateString()})`);
      });
      console.log("");
    }

    const pendingMigrations = availableMigrations.filter(m => !appliedNames.has(m));
    if (pendingMigrations.length > 0) {
      console.log("Pending migrations:");
      pendingMigrations.forEach(m => {
        console.log(`  ○ ${m}`);
      });
    } else {
      console.log("All migrations are up to date!");
    }

    console.log("\n" + "=".repeat(60));
  } catch (error) {
    log(`Failed to get migration status: ${error instanceof Error ? error.message : "Unknown error"}`, "error");
  } finally {
    await pool.end();
  }
}

function createMigration(name: string): void {
  if (!name) {
    log("Migration name is required", "error");
    log("Usage: pnpm migrate create <name>", "info");
    process.exit(1);
  }

  // Sanitize name
  const sanitized = name.toLowerCase().replace(/[^a-z0-9_]/g, "_");
  const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const filename = `${timestamp}_${sanitized}.sql`;
  const filepath = join(MIGRATIONS_FOLDER, filename);

  const template = `-- Migration: ${sanitized}
-- Created at: ${new Date().toISOString()}

-- Up migration

-- Down migration (for rollback)
`;

  // Ensure migrations folder exists
  if (!existsSync(MIGRATIONS_FOLDER)) {
    const mkdir = spawn("mkdir", ["-p", MIGRATIONS_FOLDER]);
    mkdir.on("close", (code) => {
      if (code !== 0) {
        log("Failed to create migrations folder", "error");
        process.exit(1);
      }
      writeMigrationFile(filepath, template, filename);
    });
  } else {
    writeMigrationFile(filepath, template, filename);
  }
}

function writeMigrationFile(filepath: string, content: string, filename: string): void {
  const fs = require("fs");
  fs.writeFileSync(filepath, content);
  log(`Created migration: ${filename}`, "success");
  log(`Edit file: ${filepath}`, "info");
}

async function resetDatabase(): Promise<void> {
  log("⚠️  WARNING: This will drop all tables in the database!", "warning");
  log("Press Ctrl+C within 5 seconds to cancel...", "warning");

  await new Promise(resolve => setTimeout(resolve, 5000));

  const pool = new Pool({
    connectionString: getConnectionString(),
  });

  try {
    // Drop all tables
    await pool.query(`
      DO $$
      DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `);

    // Drop drizzle schema
    await pool.query("DROP SCHEMA IF EXISTS drizzle CASCADE");

    log("Database reset complete", "success");
    log("Run 'pnpm migrate up' to reinitialize", "info");
  } catch (error) {
    log(`Reset failed: ${error instanceof Error ? error.message : "Unknown error"}`, "error");
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// =============================================================================
// Main
// =============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  switch (command) {
    case "up":
      await migrateUp();
      break;
    case "down":
      await migrateDown();
      break;
    case "status":
      await showStatus();
      break;
    case "create":
      createMigration(args[1]);
      break;
    case "reset":
      await resetDatabase();
      break;
    default:
      log(`Unknown command: ${command}`, "error");
      printHelp();
      process.exit(1);
  }
}

main().catch((error) => {
  log(`Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`, "error");
  process.exit(1);
});
