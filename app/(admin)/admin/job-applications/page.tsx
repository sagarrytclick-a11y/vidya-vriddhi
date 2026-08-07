'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AdminPageHeader,
  adminPagePadClass,
  adminSearchClass,
  adminFilterClass,
  adminCardClass,
  adminCardTitleClass,
} from '@/components/admin/page-ui'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination } from '@/components/ui/pagination'
import { Search, Trash2, Eye, Mail, Phone, User, Calendar, FileText, ExternalLink, X } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { adminCancelBtnClass } from '@/components/admin/modal-ui'
import { cn } from '@/lib/utils'

const POSITIONS = [
  'Full-Stack Developer',
  'Sales Executive',
  'Social Media Executive',
  'Education Counselor',
  'Graphic Designer',
  'Other',
]

interface CareerApplication {
  id: string
  name: string
  email: string
  phone: string
  position: string
  resumeUrl: string
  createdAt: string
  updatedAt: string
}

export default function JobApplicationsPage() {
  const [applications, setApplications] = useState<CareerApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [positionFilter, setPositionFilter] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [selectedApp, setSelectedApp] = useState<CareerApplication | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    appId: string | null
    appName: string | null
  }>({
    isOpen: false,
    appId: null,
    appName: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchApplications = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        ...(positionFilter && positionFilter !== 'all' && { position: positionFilter }),
      })

      const response = await fetch(`/api/career?${params}`)
      const data = await response.json()

      if (response.ok) {
        setApplications(data.applications)
        setTotal(data.pagination.total)
        setTotalPages(data.pagination.totalPages)
        setHasNext(data.pagination.hasNext)
        setHasPrev(data.pagination.hasPrev)
      } else {
        toast.error('Failed to fetch applications')
      }
    } catch {
      toast.error('Failed to fetch applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [page, limit, search, positionFilter])

  const handleDelete = async (id: string, name: string) => {
    setDeleteModal({ isOpen: true, appId: id, appName: name })
  }

  const confirmDelete = async () => {
    if (!deleteModal.appId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/career/${deleteModal.appId}`, { method: 'DELETE' })

      if (response.ok) {
        toast.success('Application deleted successfully')
        fetchApplications()
        setDeleteModal({ isOpen: false, appId: null, appName: null })
      } else {
        toast.error('Failed to delete application')
      }
    } catch {
      toast.error('Failed to delete application')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <AdminLayout>
      <div className={adminPagePadClass}>
        <AdminPageHeader
          title="Job Applications"
          subtitle="Manage career applications and resumes"
          action={
            <div className="text-white">
              <span className="text-sm text-gray-400">Total:</span>
              <span className="ml-2 text-lg font-semibold">{total}</span>
            </div>
          }
        />

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
            <Input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={adminSearchClass}
            />
          </div>
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className={`w-48 ${adminFilterClass}`}>
              <SelectValue placeholder="Filter by position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {POSITIONS.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className={adminCardClass}>
          <CardHeader>
            <CardTitle className={adminCardTitleClass}>All Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-[#ea580c] border-t-transparent rounded-full" />
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No applications found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Applicant</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Contact</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Position</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Resume</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Applied</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-white font-medium">{app.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-300 text-sm">{app.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-300 text-sm">{app.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-orange-300 border-orange-500/30 bg-orange-500/10">
                            {app.position}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-teal-400 hover:text-teal-300 text-sm"
                          >
                            <FileText className="h-4 w-4" />
                            View PDF
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-400 text-sm flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(app.createdAt)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-teal-400 hover:text-teal-300 hover:bg-slate-700"
                              onClick={() => {
                                setSelectedApp(app)
                                setIsViewModalOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                              onClick={() => handleDelete(app.id, app.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {!loading && applications.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1) }}
            hasNext={hasNext}
            hasPrev={hasPrev}
          />
        )}

        {isViewModalOpen && selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-[#080a0e]/75 backdrop-blur-md"
              onClick={() => setIsViewModalOpen(false)}
            />
            <div className="admin-modal relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/6 bg-[#12161e] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
              <div className="flex shrink-0 items-start justify-between border-b border-white/4 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ea580c]">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedApp.name}</h3>
                    <p className="text-sm text-[#6b7280]">Job Applicant</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsViewModalOpen(false)}
                  className="rounded-full p-2 text-[#6b7280] transition-colors hover:bg-[#0c0f14] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-6 py-5 scrollbar-thin">
                <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-[#0c0f14] px-3 py-2.5">
                  <Mail className="h-4 w-4 text-[#6b7280]" />
                  <span className="text-sm text-[#d1d5db]">{selectedApp.email}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-[#0c0f14] px-3 py-2.5">
                  <Phone className="h-4 w-4 text-[#6b7280]" />
                  <span className="text-sm text-[#d1d5db]">{selectedApp.phone}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-[#0c0f14] px-3 py-2.5">
                  <FileText className="h-4 w-4 text-[#6b7280]" />
                  <Badge variant="outline" className="border-[#ea580c]/30 bg-[#ea580c]/10 text-[#fdba74]">
                    {selectedApp.position}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-[#0c0f14] px-3 py-2.5">
                  <Calendar className="h-4 w-4 text-[#6b7280]" />
                  <span className="text-sm text-[#d1d5db]">Applied: {formatDate(selectedApp.createdAt)}</span>
                </div>
                <div className="pt-1">
                  <a
                    href={selectedApp.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#ea580c] px-4 py-2 text-sm text-white transition-colors hover:bg-[#c2410c]"
                  >
                    <FileText className="h-4 w-4" />
                    View Resume PDF
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="shrink-0 border-t border-white/4 px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsViewModalOpen(false)}
                  className={cn(adminCancelBtnClass, 'w-full')}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, appId: null, appName: null })}
          onConfirm={confirmDelete}
          title="Delete Application"
          message={`Are you sure you want to delete the application from "${deleteModal.appName}"?`}
          confirmText="Delete Application"
          cancelText="Cancel"
          type="delete"
          isLoading={isDeleting}
          details={
            deleteModal.appName
              ? [{ label: 'Applicant', value: deleteModal.appName }]
              : undefined
          }
        />
      </div>
    </AdminLayout>
  )
}
