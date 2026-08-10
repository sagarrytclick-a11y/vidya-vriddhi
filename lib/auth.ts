import { createHash, createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { type AdminRole, isAdminRole, roleCanDelete, roleCanViewLeads } from '@/lib/admin-roles'
import { db } from '@/lib/db'
import { verifyPassword, verifySecret } from '@/lib/password'

export type { AdminRole } from '@/lib/admin-roles'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET

/** Session lifetime — keep in sync with cookie maxAge on login */
export const ADMIN_TOKEN_TTL_MS = 2 * 60 * 60 * 1000 // 2 hours

export type AdminSession = {
  username: string
  role: AdminRole
  /** DB staff sessionVersion, or env password fingerprint */
  sessionVersion: string
}

type AdminAccount = {
  username: string
  password: string
  role: AdminRole
}

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

/** Fingerprint so env password rotation invalidates cookies (works with plaintext or hash) */
export function envPasswordVersion(storedPassword: string): string {
  const secret = getTokenSecret() || 'unconfigured'
  return createHmac('sha256', secret).update(`pwd:${storedPassword}`).digest('hex').slice(0, 16)
}

export function hashAdminToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/**
 * Env bootstrap accounts:
 * - ADMIN_USERNAME / ADMIN_PASSWORD → always `superadmin`
 * - Optional ADMIN_USERS JSON for extra env-based staff (admin | content_writer only)
 * - Passwords may be plaintext OR scrypt salt:hash (zero-cost hardening)
 */
export function getEnvAdminAccounts(): AdminAccount[] {
  const accounts: AdminAccount[] = []

  if (ADMIN_USERNAME && ADMIN_PASSWORD) {
    accounts.push({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
      role: 'superadmin',
    })
  }

  const raw = process.env.ADMIN_USERS
  if (raw?.trim()) {
    try {
      const parsed = JSON.parse(raw) as unknown
      if (Array.isArray(parsed)) {
        for (const entry of parsed) {
          if (!entry || typeof entry !== 'object') continue
          const username = String((entry as { username?: unknown }).username || '').trim()
          const password = String((entry as { password?: unknown }).password || '')
          const roleRaw = String((entry as { role?: unknown }).role || '').trim()
          if (!username || !password) continue
          if (roleRaw !== 'admin' && roleRaw !== 'content_writer') continue
          accounts.push({ username, password, role: roleRaw })
        }
      }
    } catch (error) {
      console.error('Invalid ADMIN_USERS JSON:', error)
    }
  }

  return accounts
}

/** @deprecated use getEnvAdminAccounts */
export function getAdminAccounts(): AdminAccount[] {
  return getEnvAdminAccounts()
}

function findEnvAccountByUsername(username: string): AdminAccount | undefined {
  return getEnvAdminAccounts().find((account) => safeEqual(account.username, username))
}

export async function authenticateAdmin(
  username: string,
  password: string
): Promise<AdminSession | null> {
  const envMatch = findEnvAccountByUsername(username)
  if (envMatch) {
    if (!verifySecret(password, envMatch.password)) return null
    return {
      username: envMatch.username,
      role: envMatch.role,
      sessionVersion: envPasswordVersion(envMatch.password),
    }
  }

  try {
    const staff = await db.adminStaff.findUnique({
      where: { username: username.trim().toLowerCase() },
    })
    if (!staff || !staff.active) return null
    if (staff.role !== 'admin' && staff.role !== 'content_writer') return null
    if (!verifyPassword(password, staff.passwordHash)) return null
    return {
      username: staff.username,
      role: staff.role,
      sessionVersion: String(staff.sessionVersion),
    }
  } catch (error) {
    console.error('DB staff auth error:', error)
    return null
  }
}

/** @deprecated Prefer authenticateAdmin */
export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  return (await authenticateAdmin(username, password)) !== null
}

/**
 * Signed admin session token:
 * base64(`${timestamp}:${username}:${role}:${sessionVersion}:${hmac}`)
 */
export function createAuthToken(session: AdminSession): string {
  const secret = getTokenSecret()
  if (!secret) {
    throw new Error('Admin session is not configured')
  }

  const timestamp = Date.now().toString()
  const payload = `${timestamp}:${session.username}:${session.role}:${session.sessionVersion}`
  const signature = createHmac('sha256', secret).update(payload).digest('hex')
  return Buffer.from(`${payload}:${signature}`).toString('base64')
}

export function getAdminSessionFromToken(token: string): AdminSession | null {
  try {
    const secret = getTokenSecret()
    if (!secret) return null

    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const parts = decoded.split(':')

    // New format: ts:user:role:sv:sig  | legacy: ts:user:role:sig (reject — force re-login)
    if (parts.length !== 5) return null

    const [timestamp, username, role, sessionVersion, signature] = parts
    if (!timestamp || !username || !role || !sessionVersion || !signature) return null
    if (!isAdminRole(role)) return null

    const payload = `${timestamp}:${username}:${role}:${sessionVersion}`
    const expected = createHmac('sha256', secret).update(payload).digest('hex')
    if (!safeEqual(signature, expected)) return null

    const tokenAge = Date.now() - parseInt(timestamp, 10)
    if (Number.isNaN(tokenAge) || tokenAge < 0 || tokenAge >= ADMIN_TOKEN_TTL_MS) {
      return null
    }

    return { username, role, sessionVersion }
  } catch {
    return null
  }
}

export async function isTokenDenied(token: string): Promise<boolean> {
  try {
    const tokenHash = hashAdminToken(token)
    const row = await db.adminTokenDeny.findUnique({ where: { tokenHash } })
    if (!row) return false
    if (row.expiresAt.getTime() <= Date.now()) {
      await db.adminTokenDeny.delete({ where: { tokenHash } }).catch(() => {})
      return false
    }
    return true
  } catch {
    return false
  }
}

export async function revokeAdminToken(token: string): Promise<void> {
  const expiresAt = new Date(Date.now() + ADMIN_TOKEN_TTL_MS)
  const tokenHash = hashAdminToken(token)
  await db.adminTokenDeny.upsert({
    where: { tokenHash },
    create: { tokenHash, expiresAt },
    update: { expiresAt },
  })
}

/**
 * Full session check: deny-list, env password version, DB active + sessionVersion.
 */
export async function resolveAdminSession(request: NextRequest): Promise<AdminSession | null> {
  const token = request.cookies.get('admin-token')?.value
  if (!token) return null

  const session = getAdminSessionFromToken(token)
  if (!session) return null

  if (await isTokenDenied(token)) return null

  const envMatch = findEnvAccountByUsername(session.username)
  if (envMatch) {
    if (envMatch.role !== session.role) return null
    if (!safeEqual(session.sessionVersion, envPasswordVersion(envMatch.password))) return null
    return session
  }

  try {
    const staff = await db.adminStaff.findUnique({
      where: { username: session.username },
    })
    if (!staff || !staff.active) return null
    if (staff.role !== session.role) return null
    if (staff.role !== 'admin' && staff.role !== 'content_writer') return null
    if (String(staff.sessionVersion) !== session.sessionVersion) return null
    return session
  } catch (error) {
    console.error('DB staff session check error:', error)
    return null
  }
}

export function verifyAuthToken(token: string): boolean {
  return getAdminSessionFromToken(token) !== null
}

export function getAdminSession(request: NextRequest): AdminSession | null {
  const token = request.cookies.get('admin-token')?.value
  if (!token) return null
  return getAdminSessionFromToken(token)
}

export function canDelete(role: AdminRole): boolean {
  return roleCanDelete(role)
}

export function canViewLeads(role: AdminRole): boolean {
  return roleCanViewLeads(role)
}

export function isAdminRequest(request: NextRequest): boolean {
  return getAdminSession(request) !== null
}

/** Live check — deactivated / revoked users cannot see draft CMS content */
export async function activeContentFilter(
  request: NextRequest
): Promise<{ active: true } | Record<string, never>> {
  const session = await resolveAdminSession(request)
  return session ? {} : { active: true }
}

export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const session = await resolveAdminSession(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export async function requireCanDelete(request: NextRequest): Promise<NextResponse | null> {
  const session = await resolveAdminSession(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!canDelete(session.role)) {
    return NextResponse.json(
      { error: 'Forbidden: content writers cannot delete records' },
      { status: 403 }
    )
  }
  return null
}

/** Enquiries + career applications — admin / superadmin only */
export async function requireCanViewLeads(request: NextRequest): Promise<NextResponse | null> {
  const session = await resolveAdminSession(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!canViewLeads(session.role)) {
    return NextResponse.json(
      { error: 'Forbidden: content writers cannot access leads' },
      { status: 403 }
    )
  }
  return null
}

/** Only env superadmin can manage staff — re-validates env account + deny list */
export async function requireSuperAdmin(request: NextRequest): Promise<NextResponse | null> {
  const session = await resolveAdminSession(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.role !== 'superadmin') {
    return NextResponse.json(
      { error: 'Forbidden: only superadmin can manage staff accounts' },
      { status: 403 }
    )
  }
  const envMatch = findEnvAccountByUsername(session.username)
  if (!envMatch || envMatch.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}

export async function bumpStaffSessionVersion(staffId: string): Promise<void> {
  await db.adminStaff.update({
    where: { id: staffId },
    data: { sessionVersion: { increment: 1 } },
  })
}
