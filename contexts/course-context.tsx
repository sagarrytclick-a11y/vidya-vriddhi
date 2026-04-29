'use client'

import { createContext, useContext, ReactNode, useState } from 'react'
import { useAdminCourses, Course, CourseFormData } from '@/hooks/useAdminCourses'

interface CourseContextType {
  // Data
  courses: Course[]
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }

  // Pagination actions
  setPage: (page: number) => void

  // Mutations
  createCourse: (data: CourseFormData) => Promise<void>
  updateCourse: (id: string, data: Partial<CourseFormData>) => Promise<void>
  deleteCourse: (id: string) => Promise<void>

  // Loading states
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean

  // Modal state
  selectedCourse: Course | null
  setSelectedCourse: (course: Course | null) => void
  isViewModalOpen: boolean
  setIsViewModalOpen: (open: boolean) => void
  isEditModalOpen: boolean
  setIsEditModalOpen: (open: boolean) => void
  isDeleteModalOpen: boolean
  setIsDeleteModalOpen: (open: boolean) => void
  isAddModalOpen: boolean
  setIsAddModalOpen: (open: boolean) => void

  // Modal actions
  openViewModal: (course: Course) => void
  closeViewModal: () => void
  openEditModal: (course: Course) => void
  closeEditModal: () => void
  openDeleteModal: (course: Course) => void
  closeDeleteModal: () => void
  openAddModal: () => void
  closeAddModal: () => void

  // Refetch
  refetchCourses: () => Promise<any>
}

const CourseContext = createContext<CourseContextType | undefined>(undefined)

interface CourseProviderProps {
  children: ReactNode
}

export function CourseProvider({ children }: CourseProviderProps) {
  const [page, setPage] = useState(1)
  const limit = 10

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
    isDeleting,
    refetchCourses,
  } = useAdminCourses(page, limit)

  // Modal state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Modal actions
  const openViewModal = (course: Course) => {
    setSelectedCourse(course)
    setIsViewModalOpen(true)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedCourse(null)
  }

  const openEditModal = (course: Course) => {
    setSelectedCourse(course)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedCourse(null)
  }

  const openDeleteModal = (course: Course) => {
    setSelectedCourse(course)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedCourse(null)
  }

  const openAddModal = () => {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  const value: CourseContextType = {
    // Data
    courses,
    isLoading,
    error,
    pagination,

    // Pagination actions
    setPage,

    // Mutations
    createCourse,
    updateCourse,
    deleteCourse,

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,

    // Modal state
    selectedCourse,
    setSelectedCourse,
    isViewModalOpen,
    setIsViewModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isAddModalOpen,
    setIsAddModalOpen,

    // Modal actions
    openViewModal,
    closeViewModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openAddModal,
    closeAddModal,

    // Refetch
    refetchCourses,
  }

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  )
}

export function useCourseContext() {
  const context = useContext(CourseContext)
  if (context === undefined) {
    throw new Error('useCourseContext must be used within a CourseProvider')
  }
  return context
}
