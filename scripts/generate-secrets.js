/**
 * Generate secure secrets for Oil Amor production environment
 *
 * Usage:
 *   node scripts/generate-secrets.js "your-secure-admin-password"
 *
 * This generates:
 *   - ADMIN_API_KEY        (64-char random hex — for Bearer token API auth)
 *   - ADMIN_PASSWORD_HASH  (bcrypt hash — for human admin login)
 *   - IRON_SESSION_PASSWORD (64-char random — for user session encryption)
 *   - ADMIN_SESSION_PASSWORD (64-char random — for admin session encryption)
 */

const crypto = require('crypto');

// Use local bcrypt from the project
const bcrypt = require('bcryptjs');

function generateRandomString(length = 64) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

async function main() {
  const adminPassword = process.argv[2];

  if (!adminPassword || adminPassword.length < 12) {
    console.error('❌ Please provide a strong admin password (min 12 characters).');
    console.error('');
    console.error('Usage:');
    console.error('  node scripts/generate-secrets.js "YourSecurePassword123!"');
    console.error('');
    console.error('Tip: Use a password manager to generate a 20+ character passphrase.');
    process.exit(1);
  }

  console.log('🔐 Generating secrets...\n');

  const adminApiKey = generateRandomString(64);
  const ironSessionPassword = generateRandomString(64);
  const adminSessionPassword = generateRandomString(64);
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  console.log('========================================');
  console.log('COPY THESE INTO YOUR .env FILE');
  console.log('========================================');
  console.log('');
  console.log(`ADMIN_API_KEY=${adminApiKey}`);
  console.log(`ADMIN_PASSWORD_HASH=${adminPasswordHash}`);
  console.log(`IRON_SESSION_PASSWORD=${ironSessionPassword}`);
  console.log(`ADMIN_SESSION_PASSWORD=${adminSessionPassword}`);
  console.log('');
  console.log('========================================');
  console.log('VERCEL / PRODUCTION ENV VARS');
  console.log('========================================');
  console.log('');
  console.log('If deploying to Vercel, add these in:');
  console.log('  Settings → Environment Variables');
  console.log('');
  console.log('⚠️  IMPORTANT:');
  console.log('  • Do NOT commit this file output to git');
  console.log('  • Store the original admin password in your password manager');
  console.log('  • Keep ADMIN_API_KEY separate — it is for API/Bearer use only');
  console.log('  • Rotate these immediately if you suspect they were leaked');
  console.log('');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
