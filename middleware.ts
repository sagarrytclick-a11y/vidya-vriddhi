import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth'

// Define which routes should be protected for users
const isUserProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/saved(.*)',
  '/applications(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl

  // Check if the path is an admin route
  if (pathname.startsWith('/admin')) {
    // Skip middleware for login page itself
    if (pathname === '/admin-login') {
      return NextResponse.next()
    }

    // Get token from cookies
    const token = req.cookies.get('admin-token')?.value

    // If no token or invalid token, redirect to admin login
    if (!token || !verifyAuthToken(token)) {
      const loginUrl = new URL('/admin-login', req.url)
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

  // Apply Clerk auth for user routes
  if (isUserProtectedRoute(req)) {
    const { userId } = await auth()
    if (!userId) {
      return new Response(null, { status: 401 })
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|svelte|svg))*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
