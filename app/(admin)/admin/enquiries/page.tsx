'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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
import { adminSelectContentClass, adminCancelBtnClass } from '@/components/admin/modal-ui'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination } from '@/components/ui/pagination'
import { Search, Trash2, Eye, Mail, Phone, User, Calendar, MapPin, X } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmModal } from '@/components/ui/confirm-modal'

interface Enquiry {
  id: string
  name: string
  email: string
  phone?: string
  city?: string
  category?: string
  status: 'PENDING' | 'RESOLVED' | 'FOLLOW_UP'
  createdAt: string
  updatedAt: string
}

export default function EnquiriesPage() {
  return (
    <Suspense fallback={
      <AdminLayout>
        <div className={adminPagePadClass}>
          <p className="text-sm text-[#6b7280]">Loading enquiries…</p>
        </div>
      </AdminLayout>
    }>
      <EnquiriesPageContent />
    </Suspense>
  )
}

function EnquiriesPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const statusFromUrl = searchParams.get('status') || ''
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(statusFromUrl)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    enquiryId: string | null
    enquiryName: string | null
  }>({
    isOpen: false,
    enquiryId: null,
    enquiryName: null
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchEnquiries = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        ...(statusFilter && statusFilter !== 'all' && { status: statusFilter })
      })
      
      const response = await fetch(`/api/enquiries?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setEnquiries(data.enquiries)
        setTotal(data.pagination.total)
        setTotalPages(data.pagination.totalPages)
        setHasNext(data.pagination.hasNext)
        setHasPrev(data.pagination.hasPrev)
      } else {
        toast.error('Failed to fetch enquiries')
      }
    } catch (error) {
      toast.error('Failed to fetch enquiries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setStatusFilter(statusFromUrl)
    setPage(1)
  }, [statusFromUrl])

  useEffect(() => {
    setLoading(true)
    fetchEnquiries()
  }, [page, limit, search, statusFilter])

  const handleStatusFilterChange = (value: string) => {
    const next = !value || value === 'all' ? '' : value
    setStatusFilter(next)
    setPage(1)
    const params = new URLSearchParams(searchParams.toString())
    if (!next) {
      params.delete('status')
    } else {
      params.set('status', next)
    }
    const qs = params.toString()
    router.replace(qs ? `/admin/enquiries?${qs}` : '/admin/enquiries')
  }

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success('Status updated successfully')
        fetchEnquiries()
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      enquiryId: id,
      enquiryName: name
    })
  }

  const confirmDelete = async () => {
    if (!deleteModal.enquiryId) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/enquiries/${deleteModal.enquiryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Enquiry deleted successfully')
        fetchEnquiries()
        setDeleteModal({ isOpen: false, enquiryId: null, enquiryName: null })
      } else {
        toast.error('Failed to delete enquiry')
      }
    } catch (error) {
      toast.error('Failed to delete enquiry')
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'border-amber-500/30 bg-amber-500/15 text-amber-300 hover:bg-amber-500/20'
      case 'RESOLVED':
        return 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20'
      case 'FOLLOW_UP':
        return 'border-[#ea580c]/30 bg-[#ea580c]/15 text-[#fdba74] hover:bg-[#ea580c]/20'
      default:
        return 'border-white/10 bg-white/5 text-[#9ca3af] hover:bg-white/10'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminLayout>
      <div className={adminPagePadClass}>
        <AdminPageHeader
          title="All Enquiries"
          subtitle="Manage student enquiries and contacts"
          action={
            <div className="text-white">
              <span className="text-sm text-gray-400">Total Enquiries:</span>
              <span className="ml-2 text-lg font-semibold">{total}</span>
            </div>
          }
        />

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
            <Input
              type="text"
              placeholder="Search by name, email, city, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={adminSearchClass}
            />
          </div>
          <Select value={statusFilter || 'all'} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className={cn('w-48', adminFilterClass)}>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className={adminSelectContentClass}>
              <SelectItem value="all" className="focus:bg-[#1e2430] focus:text-white">All Status</SelectItem>
              <SelectItem value="PENDING" className="focus:bg-[#1e2430] focus:text-white text-amber-300">Pending</SelectItem>
              <SelectItem value="RESOLVED" className="focus:bg-[#1e2430] focus:text-white text-emerald-300">Resolved</SelectItem>
              <SelectItem value="FOLLOW_UP" className="focus:bg-[#1e2430] focus:text-white text-[#fdba74]">Follow Up</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className={adminCardClass}>
          <CardHeader>
            <CardTitle className={adminCardTitleClass}>All Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-[#ea580c] border-t-transparent rounded-full"></div>
              </div>
            ) : enquiries.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No enquiries found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Student</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Contact</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Category</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Created</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((enquiry) => (
                      <tr key={enquiry.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#ea580c] rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="text-white font-medium">{enquiry.name}</div>
                              {enquiry.city && (
                                <div className="text-gray-400 text-xs flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {enquiry.city}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-300 text-sm">{enquiry.email}</span>
                            </div>
                            {enquiry.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-300 text-sm">{enquiry.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {enquiry.category ? (
                            <Badge variant="outline" className="rounded-lg border-white/10 bg-[#0c0f14] text-[#9ca3af]">
                              {enquiry.category}
                            </Badge>
                          ) : (
                            <span className="text-[#6b7280] text-sm">Not specified</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={cn('rounded-lg capitalize', getStatusColor(enquiry.status))}>
                            {enquiry.status.replace('_', ' ').toLowerCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-400 text-sm flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(enquiry.createdAt)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-400 hover:text-green-300 hover:bg-slate-700"
                              onClick={() => {
                                setSelectedEnquiry(enquiry)
                                setIsViewModalOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Select
                              value={enquiry.status}
                              onValueChange={(value) => handleStatusUpdate(enquiry.id, value)}
                            >
                              <SelectTrigger className="h-8 w-[120px] rounded-lg border-white/6 bg-[#0c0f14] text-xs text-[#d1d5db] focus:ring-[#ea580c]/30">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className={adminSelectContentClass}>
                                <SelectItem value="PENDING" className="focus:bg-[#1e2430] focus:text-amber-300 text-amber-300">
                                  Pending
                                </SelectItem>
                                <SelectItem value="RESOLVED" className="focus:bg-[#1e2430] focus:text-emerald-300 text-emerald-300">
                                  Resolved
                                </SelectItem>
                                <SelectItem value="FOLLOW_UP" className="focus:bg-[#1e2430] focus:text-[#fdba74] text-[#fdba74]">
                                  Follow Up
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                              onClick={() => handleDelete(enquiry.id, enquiry.name)}
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

        {/* Pagination */}
        {!loading && enquiries.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit)
              setPage(1) // Reset to first page when changing limit
            }}
            hasNext={hasNext}
            hasPrev={hasPrev}
          />
        )}

        {/* View Modal */}
        {isViewModalOpen && selectedEnquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-[#080a0e]/75 backdrop-blur-md"
              onClick={() => setIsViewModalOpen(false)}
            />
            <div className="admin-modal relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/6 bg-[#12161e] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
              <div className="flex shrink-0 items-start justify-between border-b border-white/4 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ea580c]">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedEnquiry.name}</h3>
                    <p className="text-sm text-[#6b7280]">Student Enquiry</p>
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
                  <span className="text-sm text-[#d1d5db]">{selectedEnquiry.email}</span>
                </div>

                {selectedEnquiry.phone && (
                  <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-[#0c0f14] px-3 py-2.5">
                    <Phone className="h-4 w-4 text-[#6b7280]" />
                    <span className="text-sm text-[#d1d5db]">{selectedEnquiry.phone}</span>
                  </div>
                )}

                {selectedEnquiry.city && (
                  <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-[#0c0f14] px-3 py-2.5">
                    <MapPin className="h-4 w-4 text-[#6b7280]" />
                    <span className="text-sm text-[#d1d5db]">{selectedEnquiry.city}</span>
                  </div>
                )}

                {selectedEnquiry.category && (
                  <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-[#0c0f14] px-3 py-2.5">
                    <User className="h-4 w-4 text-[#6b7280]" />
                    <span className="text-sm text-[#d1d5db]">{selectedEnquiry.category}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-[#0c0f14] px-3 py-2.5">
                  <Calendar className="h-4 w-4 text-[#6b7280]" />
                  <span className="text-sm text-[#d1d5db]">
                    Created: {formatDate(selectedEnquiry.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/6 bg-[#0c0f14] px-3 py-2.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-[#6b7280]">Status</span>
                  <Badge variant="outline" className={cn('rounded-lg capitalize', getStatusColor(selectedEnquiry.status))}>
                    {selectedEnquiry.status.replace('_', ' ').toLowerCase()}
                  </Badge>
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
        
        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, enquiryId: null, enquiryName: null })}
          onConfirm={confirmDelete}
          title="Delete Enquiry"
          message={`Are you sure you want to delete the enquiry from "${deleteModal.enquiryName}"?`}
          confirmText="Delete Enquiry"
          cancelText="Cancel"
          type="delete"
          isLoading={isDeleting}
          details={
            deleteModal.enquiryName
              ? [{ label: 'Enquiry from', value: deleteModal.enquiryName }]
              : undefined
          }
        />
      </div>
    </AdminLayout>
  )
}
