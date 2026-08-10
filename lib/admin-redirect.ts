/**
 * Only allow relative /admin paths (blocks open redirects / protocol-relative URLs).
 * Safe to import from client components (no Node crypto).
 */
const DEFAULT_ADMIN_HOME = '/admin/dashboard'

export function safeAdminRedirectPath(redirect: string | null | undefined): string {
  if (!redirect) return DEFAULT_ADMIN_HOME
  if (!redirect.startsWith('/')) return DEFAULT_ADMIN_HOME
  if (redirect.startsWith('//')) return DEFAULT_ADMIN_HOME
  if (redirect.includes('://') || redirect.includes('\\') || redirect.includes('@')) {
    return DEFAULT_ADMIN_HOME
  }
  if (!redirect.startsWith('/admin')) return DEFAULT_ADMIN_HOME
  if (redirect === '/admin-login' || redirect.startsWith('/admin-login?')) {
    return DEFAULT_ADMIN_HOME
  }
  // Bare /admin has no page — send to dashboard
  if (redirect === '/admin' || redirect === '/admin/') return DEFAULT_ADMIN_HOME
  return redirect
}
