import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth'
import { safeAdminRedirectPath } from '@/lib/admin-redirect'

// Define which routes should be protected for users
const isUserProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/saved(.*)',
  '/applications(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin-login') {
      return NextResponse.next()
    }

    const token = req.cookies.get('admin-token')?.value

    if (!token || !verifyAuthToken(token)) {
      const loginUrl = new URL('/admin-login', req.url)
      loginUrl.searchParams.set('redirect', safeAdminRedirectPath(pathname))
      return NextResponse.redirect(loginUrl)
    }

    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  }

  if (isUserProtectedRoute(req)) {
    const { userId } = await auth()
    if (!userId) {
      return new Response(null, { status: 401 })
    }
  }
})

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin-login',
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|svelte|svg))*)',
  ],
}
