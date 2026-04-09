#!/usr/bin/env tsx
// =============================================================================
// Environment Variables Verification Script
// =============================================================================
// Validates all required environment variables are set and properly formatted
// =============================================================================

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

// Color codes
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  reset: "\x1b[0m",
};

// Required environment variables configuration
const REQUIRED_VARS = {
  // Shopify
  NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: {
    required: true,
    validate: (value: string) => !value.includes("http") && value.includes(".myshopify.com"),
    hint: "Format: your-store.myshopify.com (no https://)",
  },
  NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: {
    required: true,
    validate: (value: string) => value.length > 20,
    hint: "Get from Shopify Admin > Apps > Develop apps",
  },
  SHOPIFY_ADMIN_ACCESS_TOKEN: {
    required: true,
    validate: (value: string) => value.startsWith("shpat_") || value.length > 30,
    hint: "Admin API token from Shopify private app",
  },
  
  // Sanity
  NEXT_PUBLIC_SANITY_PROJECT_ID: {
    required: true,
    validate: (value: string) => /^[a-z0-9]+$/.test(value) && value.length >= 8,
    hint: "Get from sanity.io/manage > Project settings",
  },
  NEXT_PUBLIC_SANITY_DATASET: {
    required: true,
    validate: (value: string) => ["development", "staging", "production"].includes(value),
    hint: "Should be: development, staging, or production",
  },
  SANITY_API_TOKEN: {
    required: true,
    validate: (value: string) => value.startsWith("sk") && value.length > 20,
    hint: "Get from sanity.io/manage > API > Tokens",
  },
  
  // Redis
  UPSTASH_REDIS_REST_URL: {
    required: true,
    validate: (value: string) => value.startsWith("https://") && value.includes("upstash.io"),
    hint: "Get from Upstash console > Database details",
  },
  UPSTASH_REDIS_REST_TOKEN: {
    required: true,
    validate: (value: string) => value.length > 20,
    hint: "Get from Upstash console > Database details",
  },
  
  // Australia Post
  AUSPOST_API_KEY: {
    required: true,
    validate: (value: string) => value.length > 10,
    hint: "Get from developers.auspost.com.au",
  },
  AUSPOST_API_SECRET: {
    required: true,
    validate: (value: string) => value.length > 10,
    hint: "Get from developers.auspost.com.au",
  },
  
  // App
  NEXT_PUBLIC_APP_ENV: {
    required: true,
    validate: (value: string) => ["development", "staging", "production"].includes(value),
    hint: "Should be: development, staging, or production",
  },
} as const;

// Optional variables
const OPTIONAL_VARS = [
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
  "PAYPAL_CLIENT_SECRET",
  "SENTRY_DSN",
  "VERCEL_ANALYTICS_ID",
];

// Validation results
interface ValidationResult {
  name: string;
  present: boolean;
  valid: boolean;
  hint?: string;
  value?: string;
}

function validateVariable(name: string, config: typeof REQUIRED_VARS[keyof typeof REQUIRED_VARS]): ValidationResult {
  const value = process.env[name];
  
  if (!value) {
    return {
      name,
      present: false,
      valid: false,
      hint: config.hint,
    };
  }
  
  const valid = config.validate(value);
  
  return {
    name,
    present: true,
    valid,
    hint: valid ? undefined : config.hint,
    value: value.substring(0, 10) + "...",
  };
}

function printResult(result: ValidationResult): void {
  const icon = result.present && result.valid 
    ? `${colors.green}✓${colors.reset}`
    : result.present 
      ? `${colors.yellow}⚠${colors.reset}`
      : `${colors.red}✗${colors.reset}`;
  
  console.log(`  ${icon} ${result.name}`);
  
  if (result.hint) {
    console.log(`      ${colors.yellow}Hint: ${result.hint}${colors.reset}`);
  }
  
  if (result.value && !result.valid) {
    console.log(`      ${colors.yellow}Current value: ${result.value}${colors.reset}`);
  }
}

async function main(): Promise<void> {
  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║          Environment Variables Verification                  ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");
  
  const results: ValidationResult[] = [];
  
  console.log("Required Variables:\n");
  for (const [name, config] of Object.entries(REQUIRED_VARS)) {
    const result = validateVariable(name, config);
    results.push(result);
    printResult(result);
  }
  
  console.log("\nOptional Variables:\n");
  for (const name of OPTIONAL_VARS) {
    const value = process.env[name];
    if (value) {
      console.log(`  ${colors.green}✓${colors.reset} ${name} (set)`);
    } else {
      console.log(`  ${colors.yellow}○${colors.reset} ${name} (not set)`);
    }
  }
  
  // Summary
  const requiredResults = results.filter(r => REQUIRED_VARS[r.name as keyof typeof REQUIRED_VARS]?.required);
  const present = requiredResults.filter(r => r.present).length;
  const valid = requiredResults.filter(r => r.valid).length;
  const total = requiredResults.length;
  
  console.log("\n" + "=".repeat(64));
  console.log("Summary:\n");
  console.log(`  Required variables: ${present}/${total} present`);
  console.log(`  Valid format: ${valid}/${total}`);
  
  if (valid === total) {
    console.log(`\n  ${colors.green}✓ All environment variables are properly configured!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n  ${colors.red}✗ Some environment variables need attention.${colors.reset}\n`);
    console.log("  Please update your .env.local file and try again.\n");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("\n✗ Verification failed:", error);
  process.exit(1);
});
