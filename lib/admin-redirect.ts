/**
 * Only allow relative /admin paths (blocks open redirects / protocol-relative URLs).
 * Safe to import from client components (no Node crypto).
 */
export function safeAdminRedirectPath(redirect: string | null | undefined): string {
  if (!redirect) return '/admin'
  if (!redirect.startsWith('/')) return '/admin'
  if (redirect.startsWith('//')) return '/admin'
  if (redirect.includes('://') || redirect.includes('\\') || redirect.includes('@')) return '/admin'
  if (!redirect.startsWith('/admin')) return '/admin'
  if (redirect === '/admin-login' || redirect.startsWith('/admin-login?')) return '/admin'
  return redirect
}
