"use client"
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
import { CourseProvider, useCourseContext } from '@/contexts/course-context'
import { CourseUIProvider, useCourseUIContext } from '@/contexts/course-ui-context'
import { Course, CourseFormData } from '@/hooks/useAdminCourses'
import { Plus, Trash2, Eye, Edit, Building } from 'lucide-react'
import { Pagination } from '@/components/ui/pagination'

const AddCourseModal = dynamic(() => import('@/components/admin/courses/add-course-modal').then(m => ({ default: m.AddCourseModal })))
const ViewCourseModal = dynamic(() => import('@/components/admin/courses/view-course-modal').then(m => ({ default: m.ViewCourseModal })))
const EditCourseModal = dynamic(() => import('@/components/admin/courses/edit-course-modal').then(m => ({ default: m.EditCourseModal })))
const DeleteCourseModal = dynamic(() => import('@/components/admin/courses/delete-course-modal').then(m => ({ default: m.DeleteCourseModal })))

// Inner component that uses the UI context
function CoursesPageContent() {
  const [searchTerm, setSearchTerm] = useState('')

  // Data from CourseContext
  const {
    courses,
    pagination,
    isLoading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
    isCreating,
    isUpdating,
    setPage,
    setLimit,
  } = useCourseContext()

  // UI state from CourseUIContext
  const {
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
    selectedCourse
  } = useCourseUIContext()

  const handleCreateCourse = (data: CourseFormData) => {
    closeAddModal()
    void createCourse(data)
  }

  const handleUpdateCourse = (id: string, data: Partial<CourseFormData>) => {
    closeEditModal()
    void updateCourse(id, data)
  }

  const handleDeleteCourse = async (course: any) => {
    openDeleteModal(course)
  }

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (isLoading) {
    return (
      <AdminLayout>
        <AdminPageSkeleton rows={6} columns={6} />
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className={adminPagePadClass}>
          <div className="flex items-center justify-center min-h-96">
            <div className="text-red-500">Error: {error}</div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className={adminPagePadClass}>
        <AdminPageHeader
          title="Course List"
          action={
            <Button onClick={openAddModal} className={adminPageActionClass}>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          }
        />

        <AdminSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search courses..."
        />

        <Card className={adminCardClass}>
          <CardHeader>
            <CardTitle className={adminCardTitleClass}>Course List</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCourses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  {searchTerm ? 'No courses found matching your search.' : 'No courses found. Create your first course!'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Slug</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Colleges</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Created</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-white font-medium">{course.name}</p>
                            <p className="text-gray-400 text-sm truncate max-w-xs">
                              {course.description || 'No description'}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-300 text-sm">{course.slug}</p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={course.active ? "default" : "secondary"}>
                            {course.active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-300 text-sm">
                              {course._count?.colleges ?? course.colleges?.length ?? 0}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-300 text-sm">
                            {new Date(course.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-teal-400 hover:text-teal-300 hover:bg-slate-700"
                              onClick={() => openViewModal(course)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-400 hover:text-green-300 hover:bg-slate-700"
                              onClick={() => openEditModal(course)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                              onClick={() => handleDeleteCourse(course)}
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
        {pagination.total > 0 && (
          <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/5">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={setPage}
              onLimitChange={(newLimit) => {
                setLimit(newLimit)
                setPage(1)
              }}
              hasNext={pagination.page < pagination.totalPages}
              hasPrev={pagination.page > 1}
            />
          </div>
        )}

        <AddCourseModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onSubmit={handleCreateCourse}
        />

        <ViewCourseModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          course={selectedCourse}
        />

        <EditCourseModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          course={selectedCourse}
          onUpdate={handleUpdateCourse}
          isUpdating={isUpdating}
        />

        <DeleteCourseModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          course={selectedCourse}
        />
      </div>
    </AdminLayout>
  )
}

export default function CoursesPage() {
  return (
    <CourseProvider>
      <CourseUIProvider>
        <CoursesPageContent />
      </CourseUIProvider>
    </CourseProvider>
  )
}
