import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is an admin route
  if (pathname.startsWith('/admin/dashboard')) {
    // Skip middleware for login page itself
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    // Get token from cookies
    const token = request.cookies.get('admin-token')?.value

    // If no token or invalid token, redirect to login
    if (!token || !verifyAuthToken(token)) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
