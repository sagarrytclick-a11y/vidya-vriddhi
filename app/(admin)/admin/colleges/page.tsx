'use client'

import { AdminLayout } from '@/components/admin/layout'
import { CollegeList } from '@/components/admin/colleges/college-list'

export default function CollegesPage() {
  return (
    <AdminLayout>
      <CollegeList />
    </AdminLayout>
  )
}
