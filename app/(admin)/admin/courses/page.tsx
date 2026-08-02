"use client"
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { AdminLayout } from '@/components/admin/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingPage } from '@/components/ui/loading'
import { CourseProvider, useCourseContext } from '@/contexts/course-context'
import { CourseUIProvider, useCourseUIContext } from '@/contexts/course-ui-context'
import { Course, CourseFormData } from '@/hooks/useAdminCourses'
import { Search, Plus, Trash2, Eye, Edit, Building, ChevronLeft, ChevronRight } from 'lucide-react'

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
    setPage
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

  const handleCreateCourse = async (data: CourseFormData) => {
    await createCourse(data)
    closeAddModal()
  }

  const handleUpdateCourse = async (id: string, data: Partial<CourseFormData>) => {
    await updateCourse(id, data)
    closeEditModal()
  }

  const handleDeleteCourse = async (course: any) => {
    openDeleteModal(course)
  }

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <LoadingPage text="Loading courses..." />
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-red-500">Error: {error}</div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Courses</h1>
          <Button
            onClick={openAddModal}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Course List</CardTitle>
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
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-400">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} courses
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination.page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={
                      pageNum === pagination.page
                        ? "bg-teal-600 hover:bg-teal-700 text-white"
                        : "border-slate-600 text-white hover:bg-slate-700"
                    }
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
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
