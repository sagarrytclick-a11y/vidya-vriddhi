import { NextRequest, NextResponse } from 'next/server'
import { canDelete, canViewLeads, resolveAdminSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await resolveAdminSession(request)

    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: 'Token is valid',
      username: session.username,
      role: session.role,
      canDelete: canDelete(session.role),
      canViewLeads: canViewLeads(session.role),
    })
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
