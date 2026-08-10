import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyCredentials, createAuthToken, ADMIN_TOKEN_TTL_MS } from '@/lib/auth'
import { enforceRateLimit } from '@/lib/rate-limit'

const loginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
})

export async function POST(request: NextRequest) {
  try {
    // Per-IP: slow down spray attacks (Vercel-trusted IP)
    const ipLimited = enforceRateLimit(request, 'admin-login', 10, 15 * 60_000)
    if (ipLimited) return ipLimited

    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const { username, password } = parsed.data
    const normalizedUser = username.trim().toLowerCase()

    // Per-username: stop hammering one account from many IPs
    const userLimited = enforceRateLimit(request, {
      scope: 'admin-login-user',
      limit: 5,
      windowMs: 15 * 60_000,
      identityKeys: [`user:${normalizedUser}`],
    })
    if (userLimited) return userLimited

    if (verifyCredentials(username, password)) {
      let token: string
      try {
        token = createAuthToken()
      } catch (err) {
        console.error('Admin session secret misconfigured:', err)
        return NextResponse.json(
          { error: 'Admin login is temporarily unavailable' },
          { status: 500 }
        )
      }

      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
      })

      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ADMIN_TOKEN_TTL_MS / 1000,
        path: '/',
      })

      return response
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
