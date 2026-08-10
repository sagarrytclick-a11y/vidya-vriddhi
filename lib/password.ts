import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'

/** Format: saltHex:hashHex */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

/** Detects scrypt salt:hash stored values (32-hex salt + 128-hex hash) */
export function isScryptHash(stored: string): boolean {
  return /^[a-f0-9]{32}:[a-f0-9]{128}$/i.test(stored)
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(':')
    if (!salt || !hash) return false
    const expected = Buffer.from(hash, 'hex')
    const actual = scryptSync(password, salt, 64)
    if (expected.length !== actual.length) return false
    return timingSafeEqual(expected, actual)
  } catch {
    return false
  }
}

/** Env secrets may be plaintext (legacy) or scrypt salt:hash */
export function verifySecret(password: string, stored: string): boolean {
  if (isScryptHash(stored)) return verifyPassword(password, stored)
  const bufA = Buffer.from(password)
  const bufB = Buffer.from(stored)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}
