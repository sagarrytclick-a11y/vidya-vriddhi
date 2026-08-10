'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { AdminLayout } from '@/components/admin/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AdminPageHeader,
  AdminSearch,
  adminPagePadClass,
  adminPageActionClass,
  adminCardClass,
  adminCardTitleClass,
  AdminPageSkeleton,
  AdminTableSkeleton,
} from '@/components/admin/page-ui'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useCanDelete } from '@/contexts/admin-context'
import { useExamContext } from '@/contexts/exam-context'
import { ExamFormData } from '@/hooks/useAdminExams'
import { Pagination } from '@/components/ui/pagination'

const AddExamModal = dynamic(() => import('@/components/admin/exams/add-exam-modal').then(m => ({ default: m.AddExamModal })))
const ViewExamModal = dynamic(() => import('@/components/admin/exams/view-exam-modal').then(m => ({ default: m.ViewExamModal })))
const DeleteExamModal = dynamic(() => import('@/components/admin/exams/delete-exam-modal').then(m => ({ default: m.DeleteExamModal })))

export default function ExamsPage() {
  const { canDelete } = useCanDelete()
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
    limit,
    setLimit,
  } = useExamContext()

  const handleCreateExam = (data: ExamFormData) => {
    closeAddModal()
    void createExam(data)
  }

  const handleEditExam = (data: ExamFormData) => {
    if (selectedExam) {
      const id = selectedExam.id
      closeEditModal()
      void updateExam(id, data)
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
      <div className={adminPagePadClass}>
        <AdminPageHeader
          title="All Exams"
          subtitle={`${pagination?.total || exams.length} exams`}
          action={
            <Button onClick={openAddModal} className={adminPageActionClass}>
              <Plus className="mr-2 h-4 w-4" />
              Add Exam
            </Button>
          }
        />

        <AdminSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search exams..."
        />

        <Card className={adminCardClass}>
          <CardHeader>
            <CardTitle className={adminCardTitleClass}>
              All Exams ({pagination?.total || exams.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <AdminTableSkeleton rows={6} columns={6} />
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
                          <Badge variant="outline" className="border-teal-500 text-teal-400">
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
                              className="text-teal-400 hover:text-teal-300 hover:bg-slate-700"
                              onClick={() => openEditModal(exam)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {canDelete && (
<Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                              onClick={() => handleDeleteExam(exam)}
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

                {/* Pagination */}
                {pagination && pagination.total > 0 && (
                  <Pagination
                    currentPage={page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                    limit={limit}
                    onPageChange={setPage}
                    onLimitChange={(newLimit) => {
                      setLimit(newLimit)
                      setPage(1)
                    }}
                    hasNext={pagination.hasNext}
                    hasPrev={pagination.hasPrev}
                  />
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
