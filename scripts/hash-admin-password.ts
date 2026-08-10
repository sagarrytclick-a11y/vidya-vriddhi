/**
 * Hash an admin password for .env (zero-cost — no paid secrets manager required).
 *
 * Usage:
 *   npx tsx scripts/hash-admin-password.ts 'your-strong-password'
 *
 * Then set in .env / Vercel:
 *   ADMIN_PASSWORD=<printed salt:hash>
 *
 * Plaintext ADMIN_PASSWORD still works for local/dev; hashed is safer if .env leaks.
 */
import { hashPassword } from '../lib/password'

const password = process.argv[2]
if (!password || password.length < 12) {
  console.error('Usage: npx tsx scripts/hash-admin-password.ts <password-min-12-chars>')
  process.exit(1)
}

console.log(hashPassword(password))
