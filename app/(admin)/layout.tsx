'use client'

import { AdminProvider } from '@/contexts/admin-context'

export default function AdminSectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminProvider>{children}</AdminProvider>
}
