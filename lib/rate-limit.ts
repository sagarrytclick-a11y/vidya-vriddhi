import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type Bucket = { count: number; resetAt: number }

const memoryBuckets = new Map<string, Bucket>()

/**
 * In-memory fallback (dev / DB outage only).
 */
function checkMemoryRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now()
  const entry = memoryBuckets.get(key)

  if (!entry || now >= entry.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true }
  }

  if (entry.count >= limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) }
  }

  entry.count += 1
  return { ok: true }
}

/**
 * Neon-backed fixed window — shared across all Vercel instances (no Redis cost).
 */
async function checkDbRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  const now = new Date()
  const resetAt = new Date(now.getTime() + windowMs)

  const existing = await db.rateLimitBucket.findUnique({ where: { id: key } })

  if (!existing || existing.resetAt.getTime() <= now.getTime()) {
    await db.rateLimitBucket.upsert({
      where: { id: key },
      create: { id: key, count: 1, resetAt },
      update: { count: 1, resetAt },
    })
    return { ok: true }
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt.getTime() - now.getTime()) / 1000)),
    }
  }

  await db.rateLimitBucket.update({
    where: { id: key },
    data: { count: { increment: 1 } },
  })
  return { ok: true }
}

async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  try {
    return await checkDbRateLimit(key, limit, windowMs)
  } catch (error) {
    console.error('DB rate limit failed, using memory fallback:', error)
    return checkMemoryRateLimit(key, limit, windowMs)
  }
}

function firstIp(value: string | null): string | null {
  if (!value) return null
  const ip = value.split(',')[0]?.trim()
  return ip || null
}

/**
 * Client IP — only trust platform headers on Vercel (prevents X-Real-IP spoofing off-platform).
 */
export function getClientIp(request: NextRequest | Request): string {
  const headers = request.headers
  const onVercel = process.env.VERCEL === '1'

  if (onVercel) {
    const vercelForwarded = firstIp(headers.get('x-vercel-forwarded-for'))
    if (vercelForwarded) return vercelForwarded

    const realIp = firstIp(headers.get('x-real-ip'))
    if (realIp) return realIp

    const forwarded = firstIp(headers.get('x-forwarded-for'))
    if (forwarded) return forwarded
  }

  // Local / non-Vercel: do not trust spoofable client headers
  return 'local-dev'
}

export type RateLimitOptions = {
  scope: string
  limit: number
  windowMs: number
  identityKeys?: string[]
}

function rateLimitResponse(retryAfterSec: number): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: { 'Retry-After': String(retryAfterSec) },
    }
  )
}

/**
 * Enforce IP-based limit (+ optional identity keys) via Neon.
 * Returns a 429 response when any bucket is exhausted, otherwise null.
 */
export async function enforceRateLimit(
  request: NextRequest | Request,
  scopeOrOptions: string | RateLimitOptions,
  limit?: number,
  windowMs?: number,
  identityKeys: string[] = []
): Promise<NextResponse | null> {
  const options: RateLimitOptions =
    typeof scopeOrOptions === 'string'
      ? {
          scope: scopeOrOptions,
          limit: limit ?? 10,
          windowMs: windowMs ?? 60_000,
          identityKeys,
        }
      : scopeOrOptions

  const ip = getClientIp(request)
  const keys = [
    `${options.scope}:ip:${ip}`,
    ...(options.identityKeys ?? []).map((k) => `${options.scope}:${k}`),
  ]

  for (const key of keys) {
    const result = await checkRateLimit(key, options.limit, options.windowMs)
    if (!result.ok) {
      return rateLimitResponse(result.retryAfterSec)
    }
  }

  return null
}
