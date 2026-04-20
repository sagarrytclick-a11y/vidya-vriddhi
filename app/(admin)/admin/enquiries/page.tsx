'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination } from '@/components/ui/pagination'
import { Search, Plus, Edit, Trash2, Eye, Mail, Phone, User, Calendar, MapPin } from 'lucide-react'
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
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
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
    fetchEnquiries()
  }, [page, limit, search, statusFilter])

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
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'RESOLVED':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'FOLLOW_UP':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
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
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Enquiries Management</h1>
            <p className="text-gray-400 text-sm mt-1">Manage student enquiries and contacts</p>
          </div>
          <div className="text-white">
            <span className="text-sm text-gray-400">Total Enquiries:</span>
            <span className="ml-2 text-lg font-semibold">{total}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, email, city, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:ring-blue-500"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="FOLLOW_UP">Follow Up</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">All Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
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
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
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
                            <Badge variant="outline" className="text-gray-300 border-slate-600">
                              {enquiry.category}
                            </Badge>
                          ) : (
                            <span className="text-gray-500 text-sm">Not specified</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(enquiry.status)}>
                            {enquiry.status.replace('_', ' ')}
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
                              <SelectTrigger className="w-32 h-8 bg-slate-700 border-slate-600 text-gray-300">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="RESOLVED">Resolved</SelectItem>
                                <SelectItem value="FOLLOW_UP">Follow Up</SelectItem>
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
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{selectedEnquiry.name}</h3>
                    <p className="text-gray-400">Student Enquiry</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{selectedEnquiry.email}</span>
                  </div>
                  
                  {selectedEnquiry.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">{selectedEnquiry.phone}</span>
                    </div>
                  )}
                  
                  {selectedEnquiry.city && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">{selectedEnquiry.city}</span>
                    </div>
                  )}
                  
                  {selectedEnquiry.category && (
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">{selectedEnquiry.category}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">
                      Created: {formatDate(selectedEnquiry.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(selectedEnquiry.status)}>
                      {selectedEnquiry.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
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
          message={`Are you sure you want to delete the enquiry from ${deleteModal.enquiryName}? This action cannot be undone.`}
          confirmText="Delete Enquiry"
          cancelText="Cancel"
          type="delete"
          isLoading={isDeleting}
        />
      </div>
    </AdminLayout>
  )
}
