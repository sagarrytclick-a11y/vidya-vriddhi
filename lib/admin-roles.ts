export type AdminRole = 'superadmin' | 'admin' | 'content_writer'

export function roleCanDelete(role: AdminRole | null | undefined): boolean {
  return role === 'superadmin' || role === 'admin'
}

/** Enquiries / job applications — not for content writers */
export function roleCanViewLeads(role: AdminRole | null | undefined): boolean {
  return role === 'superadmin' || role === 'admin'
}

export function isAdminRole(value: string): value is AdminRole {
  return value === 'superadmin' || value === 'admin' || value === 'content_writer'
}
