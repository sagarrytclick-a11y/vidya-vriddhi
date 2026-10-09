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
import {
  Search,
  Trash2,
  Eye,
  Mail,
  Phone,
  User,
  Calendar,
  X,
  Download,
  MessageSquareText,
} from 'lucide-react'
import { useCanDelete } from '@/contexts/admin-context'
import { toast } from 'sonner'
import { ConfirmModal } from '@/components/ui/confirm-modal'

interface ServiceLead {
  id: string
  name: string
  email: string
  phone: string
  message: string
  status: 'PENDING' | 'RESOLVED' | 'FOLLOW_UP'
  createdAt: string
  updatedAt: string
}

export default function ServiceLeadsPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout>
          <div className={adminPagePadClass}>
            <p className="text-sm text-[#6b7280]">Loading service leads…</p>
          </div>
        </AdminLayout>
      }
    >
      <ServiceLeadsPageContent />
    </Suspense>
  )
}

function ServiceLeadsPageContent() {
  const { canDelete } = useCanDelete()
  const searchParams = useSearchParams()
  const router = useRouter()
  const statusFromUrl = searchParams.get('status') || ''

  const [leads, setLeads] = useState<ServiceLead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(statusFromUrl)
  const [exporting, setExporting] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [selectedLead, setSelectedLead] = useState<ServiceLead | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    leadId: string | null
    leadName: string | null
  }>({ isOpen: false, leadId: null, leadName: null })
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchLeads = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        ...(statusFilter && statusFilter !== 'all' && { status: statusFilter }),
      })

      const response = await fetch(`/api/service-enquiry?${params}`)
      const data = await response.json()

      if (response.ok) {
        setLeads(data.leads || [])
        setTotal(data.pagination?.total || 0)
        setTotalPages(data.pagination?.totalPages || 0)
        setHasNext(Boolean(data.pagination?.hasNext))
        setHasPrev(Boolean(data.pagination?.hasPrev))
      } else {
        toast.error(data.error || 'Failed to fetch service leads')
      }
    } catch {
      toast.error('Failed to fetch service leads')
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
    fetchLeads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, statusFilter])

  const handleStatusFilterChange = (value: string) => {
    const next = !value || value === 'all' ? '' : value
    setStatusFilter(next)
    setPage(1)
    const params = new URLSearchParams(searchParams.toString())
    if (!next) params.delete('status')
    else params.set('status', next)
    const qs = params.toString()
    router.replace(qs ? `/admin/service-leads?${qs}` : '/admin/service-leads')
  }

  const handleExport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    setExporting(true)
    try {
      const params = new URLSearchParams({
        format,
        ...(search && { search }),
        ...(statusFilter && statusFilter !== 'all' && { status: statusFilter }),
      })
      const response = await fetch(`/api/service-enquiry/export?${params}`)
      if (!response.ok) {
        toast.error('Failed to export service leads')
        return
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const ext = format === 'xlsx' ? 'xls' : format
      link.href = url
      link.download = `service-leads.${ext}`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      toast.success(`Exported as ${format.toUpperCase()}`)
    } catch {
      toast.error('Failed to export service leads')
    } finally {
      setExporting(false)
    }
  }

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/service-enquiry/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        toast.success('Status updated successfully')
        fetchLeads()
      } else {
        toast.error('Failed to update status')
      }
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, leadId: id, leadName: name })
  }

  const confirmDelete = async () => {
    if (!deleteModal.leadId) return
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/service-enquiry/${deleteModal.leadId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        toast.success('Service lead deleted successfully')
        fetchLeads()
        setDeleteModal({ isOpen: false, leadId: null, leadName: null })
        if (selectedLead?.id === deleteModal.leadId) {
          setIsViewModalOpen(false)
          setSelectedLead(null)
        }
      } else {
        toast.error('Failed to delete service lead')
      }
    } catch {
      toast.error('Failed to delete service lead')
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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <AdminLayout>
      <div className={adminPagePadClass}>
        <AdminPageHeader
          title="All Service Leads"
          subtitle="Manage website, leads & social media enquiries"
          action={
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/6 bg-[#12161e] px-3 py-2 text-sm">
                <span className="font-semibold tabular-nums text-white">{total}</span>
                <span className="text-[#9ca3af]">total leads</span>
              </div>
              <Select
                disabled={exporting}
                onValueChange={(value) => handleExport(value as 'csv' | 'xlsx' | 'pdf')}
              >
                <SelectTrigger className={cn('w-[160px]', adminFilterClass)}>
                  <Download className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={exporting ? 'Exporting…' : 'Export'} />
                </SelectTrigger>
                <SelectContent className={adminSelectContentClass}>
                  <SelectItem value="csv" className="focus:bg-[#1e2430] focus:text-white">
                    Download CSV
                  </SelectItem>
                  <SelectItem value="xlsx" className="focus:bg-[#1e2430] focus:text-white">
                    Download Excel
                  </SelectItem>
                  <SelectItem value="pdf" className="focus:bg-[#1e2430] focus:text-white">
                    Download PDF
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
        />

        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#12161e] p-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
            <Input
              type="text"
              placeholder="Search by name, email, phone, or message..."
              aria-label="Search service leads"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={adminSearchClass}
            />
          </div>
          <Select value={statusFilter || 'all'} onValueChange={handleStatusFilterChange}>
            <SelectTrigger aria-label="Filter service leads by status" className={cn('w-full sm:w-48', adminFilterClass)}>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className={adminSelectContentClass}>
              <SelectItem value="all" className="focus:bg-[#1e2430] focus:text-white">
                All Status
              </SelectItem>
              <SelectItem value="PENDING" className="text-amber-300 focus:bg-[#1e2430] focus:text-white">
                Pending
              </SelectItem>
              <SelectItem
                value="RESOLVED"
                className="text-emerald-300 focus:bg-[#1e2430] focus:text-white"
              >
                Fulfilled
              </SelectItem>
              <SelectItem
                value="FOLLOW_UP"
                className="text-[#fdba74] focus:bg-[#1e2430] focus:text-white"
              >
                Follow Up
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className={adminCardClass}>
          <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-white/5 px-5 py-4">
            <div>
              <CardTitle className={adminCardTitleClass}>Lead inbox</CardTitle>
              <p className="mt-1 text-xs text-[#6b7280]">Review contact details and update each lead&apos;s status.</p>
            </div>
            <span className="shrink-0 text-xs tabular-nums text-[#9ca3af]">{leads.length} shown</span>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-14">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ea580c] border-t-transparent" />
              </div>
            ) : leads.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/6 bg-white/[0.03]">
                  <MessageSquareText className="h-5 w-5 text-[#9ca3af]" />
                </div>
                <p className="text-sm font-medium text-white">No service leads found</p>
                <p className="mt-1 text-xs text-[#6b7280]">Try changing your search or status filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th scope="col" className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">Lead</th>
                      <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">Message</th>
                      <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">Status</th>
                      <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">Received</th>
                      <th scope="col" className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.025]">
                        <td className="px-5 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ea580c]/20 bg-[#ea580c]/10 text-xs font-bold text-[#fdba74]">
                              {lead.name.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0 space-y-1">
                              <p className="truncate text-sm font-semibold text-white">{lead.name}</p>
                              <a href={`mailto:${lead.email}`} className="block truncate text-xs text-[#9ca3af] transition-colors hover:text-[#fdba74]">{lead.email}</a>
                              <a href={`tel:${lead.phone}`} className="block text-xs text-[#6b7280] transition-colors hover:text-[#fdba74]">{lead.phone}</a>
                            </div>
                          </div>
                        </td>
                        <td className="max-w-[280px] px-4 py-4">
                          <p className="line-clamp-2 text-sm leading-5 text-[#c4cbc7]">{lead.message}</p>
                        </td>
                        <td className="px-4 py-4">
                          <Select
                            value={lead.status}
                            onValueChange={(value) => handleStatusUpdate(lead.id, value)}
                          >
                            <SelectTrigger
                              aria-label={`Update status for ${lead.name}`}
                              className={cn('h-8 w-[132px] rounded-lg bg-[#0c0f14] text-xs focus:ring-[#ea580c]/30', getStatusColor(lead.status))}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className={adminSelectContentClass}>
                              <SelectItem value="PENDING" className="text-amber-300 focus:bg-[#1e2430] focus:text-amber-300">Pending</SelectItem>
                              <SelectItem value="RESOLVED" className="text-emerald-300 focus:bg-[#1e2430] focus:text-emerald-300">Resolved</SelectItem>
                              <SelectItem value="FOLLOW_UP" className="text-[#fdba74] focus:bg-[#1e2430] focus:text-[#fdba74]">Follow Up</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-start gap-2 text-xs">
                            <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6b7280]" />
                            <div>
                              <p className="text-[#d1d5db]">{formatDate(lead.createdAt)}</p>
                              <p className="mt-0.5 text-[#6b7280]">{formatTime(lead.createdAt)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`View lead from ${lead.name}`}
                              title="View lead"
                              className="h-8 w-8 rounded-lg text-[#9ca3af] hover:bg-white/5 hover:text-white"
                              onClick={() => {
                                setSelectedLead(lead)
                                setIsViewModalOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {canDelete && (
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Delete lead from ${lead.name}`}
                                title="Delete lead"
                                className="h-8 w-8 rounded-lg text-[#9ca3af] hover:bg-red-500/10 hover:text-red-300"
                                onClick={() => handleDelete(lead.id, lead.name)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
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

        {!loading && leads.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit)
              setPage(1)
            }}
            hasNext={hasNext}
            hasPrev={hasPrev}
          />
        )}

        {isViewModalOpen && selectedLead && (
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
                    <h3 className="text-lg font-semibold text-white">{selectedLead.name}</h3>
                    <p className="text-sm text-[#6b7280]">Service Lead</p>
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
                  <a href={`mailto:${selectedLead.email}`} className="break-all text-sm text-[#d1d5db] hover:text-[#fdba74]">{selectedLead.email}</a>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-[#0c0f14] px-3 py-2.5">
                  <Phone className="h-4 w-4 text-[#6b7280]" />
                  <a href={`tel:${selectedLead.phone}`} className="text-sm text-[#d1d5db] hover:text-[#fdba74]">{selectedLead.phone}</a>
                </div>
                <div className="rounded-xl border border-white/6 bg-[#0c0f14] px-3 py-2.5">
                  <div className="mb-1.5 flex items-center gap-2 text-xs text-[#6b7280]">
                    <MessageSquareText className="h-3.5 w-3.5" />
                    Message
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-[#d1d5db]">{selectedLead.message}</p>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/6 bg-[#0c0f14] px-3 py-2.5">
                  <span className="text-sm text-[#6b7280]">Status</span>
                  <Badge
                    variant="outline"
                    className={cn('rounded-lg capitalize', getStatusColor(selectedLead.status))}
                  >
                    {selectedLead.status.replace('_', ' ').toLowerCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(selectedLead.createdAt)}
                </div>
              </div>

              <div className="flex shrink-0 justify-end border-t border-white/4 px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  aria-label="Close lead details"
                  title="Close"
                  onClick={() => setIsViewModalOpen(false)}
                  className={adminCancelBtnClass}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, leadId: null, leadName: null })}
          onConfirm={confirmDelete}
          title="Delete Service Lead"
          message={`Are you sure you want to delete the lead from "${deleteModal.leadName}"? This action cannot be undone.`}
          confirmText="Delete"
          isLoading={isDeleting}
          type="delete"
        />
      </div>
    </AdminLayout>
  )
}
