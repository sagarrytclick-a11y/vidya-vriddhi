import { NextRequest, NextResponse } from 'next/server'
import { revokeAdminToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value
  if (token) {
    try {
      await revokeAdminToken(token)
    } catch (error) {
      console.error('Token revoke error:', error)
    }
  }

  const response = NextResponse.json({
    success: true,
    message: 'Logout successful',
  })

  response.cookies.set('admin-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })

  return response
}
