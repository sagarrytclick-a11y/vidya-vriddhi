import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { safeAdminRedirectPath } from '@/lib/admin-redirect'

const isUserProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/saved(.*)',
  '/applications(.*)',
])

/** Live session check via Node API (DB deny-list / deactivate) — Edge-safe, $0 */
async function isLiveAdminSession(req: Request): Promise<boolean> {
  try {
    const verifyUrl = new URL('/api/admin-auth/verify', req.url)
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

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin-login') {
      return NextResponse.next()
    }

    const token = req.cookies.get('admin-token')?.value
    if (!token || !(await isLiveAdminSession(req))) {
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
