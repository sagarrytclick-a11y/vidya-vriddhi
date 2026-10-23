import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import { safeAdminRedirectPath } from '@/lib/admin-redirect'
import { resolveAdminSession } from '@/lib/auth'

const userProtectedRoutes = ['/dashboard', '/profile', '/saved', '/applications']

/**
 * Build the public origin from forwarded headers.
 * On Vercel `req.url` can point at a different host than the one the
 * browser is on (e.g. apex vs www), which caused cross-origin redirects.
 */
function getRequestOrigin(req: NextRequest): string {
  const forwardedHost = req.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const host = forwardedHost || req.headers.get('host')
  if (!host) return req.nextUrl.origin

  const forwardedProto = req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()
  const proto = forwardedProto || req.nextUrl.protocol.replace(/:$/, '') || 'https'

  try {
    return new URL(`${proto}://${host}`).origin
  } catch {
    return req.nextUrl.origin
  }
}

export default auth(async (req) => {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin-login') {
      return NextResponse.next()
    }

    // Next.js 16 `proxy.ts` runs on the Node.js runtime, so we can validate
    // the session (DB deny-list / deactivation) directly instead of doing a
    // self-fetch. The self-fetch lost the cookie on the apex → www redirect,
    // which made every admin request look unauthenticated in production.
    const session = await resolveAdminSession(req)
    if (!session) {
      const loginUrl = new URL('/admin-login', getRequestOrigin(req))
      loginUrl.searchParams.set('redirect', safeAdminRedirectPath(pathname))
      return NextResponse.redirect(loginUrl)
    }

    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  }

  const isUserProtectedRoute = userProtectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
  if (isUserProtectedRoute && !req.auth) {
    const loginUrl = new URL('/sign-in', getRequestOrigin(req))
    loginUrl.searchParams.set('callbackUrl', `${req.nextUrl.pathname}${req.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin-login',
    '/dashboard/:path*',
    '/profile/:path*',
    '/saved/:path*',
    '/applications/:path*',
  ],
}
