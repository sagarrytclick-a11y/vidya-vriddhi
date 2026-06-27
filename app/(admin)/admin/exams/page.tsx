'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { AdminLayout } from '@/components/admin/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingTable } from '@/components/ui/loading'
import { Search, Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { useExamContext } from '@/contexts/exam-context'
import { ExamFormData } from '@/hooks/useAdminExams'

const AddExamModal = dynamic(() => import('@/components/admin/exams/add-exam-modal').then(m => ({ default: m.AddExamModal })))
const ViewExamModal = dynamic(() => import('@/components/admin/exams/view-exam-modal').then(m => ({ default: m.ViewExamModal })))
const DeleteExamModal = dynamic(() => import('@/components/admin/exams/delete-exam-modal').then(m => ({ default: m.DeleteExamModal })))

export default function ExamsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  
  const {
    exams,
    isLoading,
    error,
    createExam,
    updateExam,
    deleteExam,
    openAddModal,
    closeAddModal,
    openViewModal,
    closeViewModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    isAddModalOpen,
    isViewModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedExam,
    isCreating,
    isUpdating,
    isDeleting,
    pagination,
    page,
    setPage,
  } = useExamContext()

  const handleCreateExam = async (data: ExamFormData) => {
    await createExam(data)
    closeAddModal()
  }

  const handleEditExam = async (data: ExamFormData) => {
    if (selectedExam) {
      await updateExam(selectedExam.id, data)
      closeEditModal()
    }
  }

  const handleDeleteExam = async (exam: any) => {
    openDeleteModal(exam)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const filteredExams = exams.filter(exam =>
    exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Exams Management</h1>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={openAddModal}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Exam
          </Button>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search exams..."
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">All Exams ({pagination?.total || exams.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingTable text="Loading exams..." />
            ) : exams.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {searchTerm ? 'No exams found matching your search.' : 'No exams found. Create your first exam!'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Exam Name</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Short Name</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Mode</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Frequency</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Created</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((exam) => (
                      <tr key={exam.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="py-3 px-4 text-white font-medium">{exam.name}</td>
                        <td className="py-3 px-4 text-gray-400 text-sm">{exam.shortName}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="border-blue-500 text-blue-400">
                            {exam.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="border-green-500 text-green-400">
                            {exam.mode}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="border-purple-500 text-purple-400">
                            {exam.frequency}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={exam.status === 'Active' ? 'default' : 'secondary'}>
                            {exam.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-sm">{exam.createdAt}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-slate-700" onClick={() => openViewModal(exam)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                              onClick={() => openEditModal(exam)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                              onClick={() => handleDeleteExam(exam)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
                    <div className="text-sm text-gray-400">
                      Showing {((page - 1) * pagination.limit) + 1} - {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} exams
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={!pagination.hasPrev}
                        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <Button
                            key={pageNum}
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(pageNum)}
                            className={`w-8 h-8 p-0 ${
                              pageNum === page
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'
                            }`}
                          >
                            {pageNum}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={!pagination.hasNext}
                        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <AddExamModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onSubmit={handleCreateExam}
          isSubmitting={isCreating}
        />

        <AddExamModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSubmit={handleEditExam}
          initialData={selectedExam}
          isEdit={true}
          isSubmitting={isUpdating}
        />

        <ViewExamModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          exam={selectedExam}
        />

        <DeleteExamModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          exam={selectedExam}
          onDelete={async (id: string) => {
            try {
              await deleteExam(id)
              closeDeleteModal()
            } catch (error) {
              console.error('Failed to delete exam:', error)
            }
          }}
          isDeleting={isDeleting}
        />
      </div>
    </AdminLayout>
  )
}
