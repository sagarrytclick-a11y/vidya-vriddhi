'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination } from '@/components/ui/pagination'
import { Search, Trash2, Eye, Mail, Phone, User, Calendar, FileText, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmModal } from '@/components/ui/confirm-modal'

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
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Job Applications</h1>
            <p className="text-gray-400 text-sm mt-1">Manage career applications and resumes</p>
          </div>
          <div className="text-white">
            <span className="text-sm text-gray-400">Total:</span>
            <span className="ml-2 text-lg font-semibold">{total}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:ring-teal-500"
            />
          </div>
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
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

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">All Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-teal-500 border-t-transparent rounded-full" />
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
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsViewModalOpen(false)}
            />
            <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl p-6">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-700 rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4 text-gray-400" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{selectedApp.name}</h3>
                    <p className="text-gray-400">Job Applicant</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{selectedApp.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{selectedApp.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <Badge variant="outline" className="text-orange-300 border-orange-500/30 bg-orange-500/10">
                      {selectedApp.position}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">Applied: {formatDate(selectedApp.createdAt)}</span>
                  </div>
                  <div className="pt-2">
                    <a
                      href={selectedApp.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                    >
                      <FileText className="h-4 w-4" />
                      View Resume PDF
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, appId: null, appName: null })}
          onConfirm={confirmDelete}
          title="Delete Application"
          message={`Are you sure you want to delete the application from ${deleteModal.appName}? This action cannot be undone.`}
          confirmText="Delete Application"
          cancelText="Cancel"
          type="delete"
          isLoading={isDeleting}
        />
      </div>
    </AdminLayout>
  )
}
