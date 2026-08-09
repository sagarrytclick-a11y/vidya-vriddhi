import { NextRequest, NextResponse } from 'next/server'

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

/**
 * Simple in-memory fixed-window rate limiter (per-instance).
 * Suitable for basic spam protection on public submission routes.
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

export function getClientIp(request: NextRequest | Request): string {
  const headers = request.headers
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  return headers.get('x-real-ip') || headers.get('cf-connecting-ip') || 'unknown'
}

/** Convenience: return 429 response or null if allowed */
export function enforceRateLimit(
  request: NextRequest | Request,
  scope: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const ip = getClientIp(request)
  const result = checkRateLimit(`${scope}:${ip}`, limit, windowMs)

  if (!result.ok) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(result.retryAfterSec) },
      }
    )
  }

  return null
}
