import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { safeAdminRedirectPath } from '@/lib/admin-redirect'

const userProtectedRoutes = ['/dashboard', '/profile', '/saved', '/applications']

function getPublicOrigin(req: Request): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL
  if (configuredUrl) {
    try {
      return new URL(configuredUrl).origin
    } catch {
      // Fall back to the request origin when the optional URL is malformed.
    }
  }
  return new URL(req.url).origin
}

/** Live session check via Node API (DB deny-list / deactivate) — Edge-safe, $0 */
async function isLiveAdminSession(req: Request): Promise<boolean> {
  try {
    const verifyUrl = new URL('/api/admin-auth/verify', getPublicOrigin(req))
    const res = await fetch(verifyUrl, {
      headers: {
        cookie: req.headers.get('cookie') || '',
      },
      cache: 'no-store',
    })
    return res.ok
  } catch {
    return false
  }
}

export default auth(async (req) => {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin-login') {
      return NextResponse.next()
    }

    const token = req.cookies.get('admin-token')?.value
    if (!token || !(await isLiveAdminSession(req))) {
      const loginUrl = new URL('/admin-login', getPublicOrigin(req))
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
    const loginUrl = new URL('/sign-in', getPublicOrigin(req))
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
