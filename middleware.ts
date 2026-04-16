import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is an admin route
  if (pathname.startsWith('/admin')) {
    // Skip middleware for login page itself
    if (pathname === '/admin-login') {
      return NextResponse.next()
    }

    // Get token from cookies
    const token = request.cookies.get('admin-token')?.value

    // If no token or invalid token, redirect to admin login
    if (!token || !verifyAuthToken(token)) {
      const loginUrl = new URL('/admin-login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Add cache control headers to prevent browser caching
    // This ensures users can't see cached admin pages after logout
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
