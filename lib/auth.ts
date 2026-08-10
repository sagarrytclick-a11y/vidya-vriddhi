import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET

/** Session lifetime — keep in sync with cookie maxAge on login */
export const ADMIN_TOKEN_TTL_MS = 2 * 60 * 60 * 1000 // 2 hours

function getTokenSecret(): string | null {
  if (!ADMIN_SESSION_SECRET || ADMIN_SESSION_SECRET.length < 32) {
    console.error(
      'ADMIN_SESSION_SECRET is missing or too short (min 32 chars). Admin sessions will not work.'
    )
    return null
  }
  return ADMIN_SESSION_SECRET
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export function verifyCredentials(username: string, password: string): boolean {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error('Admin credentials not configured in environment variables')
    return false
  }

  return safeEqual(username, ADMIN_USERNAME) && safeEqual(password, ADMIN_PASSWORD)
}

/**
 * Signed admin session token: base64(`${timestamp}:${username}:${hmac}`)
 * HMAC uses ADMIN_SESSION_SECRET only (never the password).
 */
export function createAuthToken(): string {
  const secret = getTokenSecret()
  if (!secret || !ADMIN_USERNAME) {
    throw new Error('Admin session is not configured')
  }

  const timestamp = Date.now().toString()
  const payload = `${timestamp}:${ADMIN_USERNAME}`
  const signature = createHmac('sha256', secret).update(payload).digest('hex')
  return Buffer.from(`${payload}:${signature}`).toString('base64')
}

export function verifyAuthToken(token: string): boolean {
  try {
    const secret = getTokenSecret()
    if (!secret || !ADMIN_USERNAME) return false

    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const parts = decoded.split(':')

    // Expected: timestamp:username:signature
    if (parts.length !== 3) return false

    const [timestamp, username, signature] = parts
    if (!timestamp || !username || !signature) return false
    if (!safeEqual(username, ADMIN_USERNAME)) return false

    const payload = `${timestamp}:${username}`
    const expected = createHmac('sha256', secret).update(payload).digest('hex')
    if (!safeEqual(signature, expected)) return false

    const tokenAge = Date.now() - parseInt(timestamp, 10)
    if (Number.isNaN(tokenAge) || tokenAge < 0 || tokenAge >= ADMIN_TOKEN_TTL_MS) {
      return false
    }

    return true
  } catch {
    return false
  }
}

/** True when request carries a valid admin session cookie */
export function isAdminRequest(request: NextRequest): boolean {
  const token = request.cookies.get('admin-token')?.value
  return Boolean(token && verifyAuthToken(token))
}

/**
 * Public listings hide drafts; admins (valid cookie) see all records.
 */
export function activeContentFilter(request: NextRequest): { active: true } | Record<string, never> {
  return isAdminRequest(request) ? {} : { active: true }
}

/**
 * Guard for admin-only API handlers.
 * Returns a 401 JSON response when the request is not an authenticated admin.
 */
export function requireAdmin(request: NextRequest): NextResponse | null {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
