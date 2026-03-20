"use client"
import { useState } from 'react'
import { AdminLayout } from '@/components/admin/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddCourseModal } from '@/components/admin/courses/add-course-modal'
import { ViewCourseModal } from '@/components/admin/courses/view-course-modal'
import { EditCourseModal } from '@/components/admin/courses/edit-course-modal'
import { DeleteCourseModal } from '@/components/admin/courses/delete-course-modal'
import { LoadingPage, LoadingTable } from '@/components/ui/loading'
import { useCourses, Course, CourseFormData } from '@/hook/useCourses'
import { Search, Plus, Trash2, Eye, Edit, Building } from 'lucide-react'

export default function CoursesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { courses, isLoading, error, createCourse, deleteCourse, updateCourse, isUpdating } = useCourses()

  const handleCreateCourse = async (data: CourseFormData) => {
    await createCourse(data)
  }

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course)
    setIsViewModalOpen(true)
  }

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course)
    setIsEditModalOpen(true)
  }

  const handleDeleteCourse = (course: Course) => {
    setSelectedCourse(course)
    setIsDeleteModalOpen(true)
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedCourse(null)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedCourse(null)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedCourse(null)
  }

  const handleUpdateCourse = async (id: string, data: Partial<CourseFormData>) => {
    await updateCourse(id, data)
    handleCloseEditModal()
  }

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
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
                              {course.colleges ? course.colleges.length : 0}
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
                              className="text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                              onClick={() => handleViewCourse(course)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-400 hover:text-green-300 hover:bg-slate-700"
                              onClick={() => handleEditCourse(course)}
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

        <AddCourseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateCourse}
        />

        <ViewCourseModal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          course={selectedCourse}
        />

        <EditCourseModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          course={selectedCourse}
          onUpdate={handleUpdateCourse}
          isUpdating={isUpdating}
        />

        <DeleteCourseModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          course={selectedCourse}
        />
      </div>
    </AdminLayout>
  )
}
