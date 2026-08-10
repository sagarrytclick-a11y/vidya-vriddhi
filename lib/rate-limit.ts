import { NextRequest, NextResponse } from 'next/server'

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

/**
 * Simple in-memory fixed-window rate limiter.
 * Works per serverless instance on Vercel (soft protection).
 * Pair with Vercel-trusted IPs so clients cannot spoof the bucket key.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now()
  const entry = buckets.get(key)

  if (!entry || now >= entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true }
  }

  if (entry.count >= limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) }
  }

  entry.count += 1
  return { ok: true }
}

function firstIp(value: string | null): string | null {
  if (!value) return null
  const ip = value.split(',')[0]?.trim()
  return ip || null
}

/**
 * Client IP on Vercel — prefer platform-set headers that clients cannot forge.
 * @see https://vercel.com/docs/headers/request-headers
 *
 * Priority:
 * 1. x-vercel-forwarded-for (Vercel-controlled)
 * 2. x-real-ip (Vercel-controlled)
 * 3. x-forwarded-for only when VERCEL=1 (also platform-managed there)
 * 4. Local/dev: shared bucket — do not trust spoofable XFF
 */
export function getClientIp(request: NextRequest | Request): string {
  const headers = request.headers

  // Vercel-specific — set at the edge, not by the browser
  const vercelForwarded = firstIp(headers.get('x-vercel-forwarded-for'))
  if (vercelForwarded) return vercelForwarded

  const realIp = firstIp(headers.get('x-real-ip'))
  if (realIp) return realIp

  // On Vercel, x-forwarded-for is platform-managed. Prefer it only when
  // VERCEL=1 so local/dev attackers cannot freely rotate fake XFF values.
  if (process.env.VERCEL === '1') {
    const forwarded = firstIp(headers.get('x-forwarded-for'))
    if (forwarded) return forwarded
  }

  // Local / non-Vercel: one shared bucket (better than trusting spoofable headers)
  return 'local-dev'
}

export type RateLimitOptions = {
  scope: string
  limit: number
  windowMs: number
  /** Extra buckets e.g. `email:user@x.com` or `user:admin` — checked in addition to IP */
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
 * Enforce IP-based limit (+ optional identity keys).
 * Returns a 429 response when any bucket is exhausted, otherwise null.
 */
export function enforceRateLimit(
  request: NextRequest | Request,
  scopeOrOptions: string | RateLimitOptions,
  limit?: number,
  windowMs?: number,
  identityKeys: string[] = []
): NextResponse | null {
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

  let maxRetry = 0
  for (const key of keys) {
    const result = checkRateLimit(key, options.limit, options.windowMs)
    if (!result.ok) {
      maxRetry = Math.max(maxRetry, result.retryAfterSec)
      return rateLimitResponse(maxRetry)
    }
  }

  return null
}
