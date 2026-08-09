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
    const limited = enforceRateLimit(request, 'admin-login', 5, 15 * 60_000)
    if (limited) return limited

    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const { username, password } = parsed.data

    if (verifyCredentials(username, password)) {
      const token = createAuthToken()

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
