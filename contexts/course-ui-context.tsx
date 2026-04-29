'use client'

import { createContext, useContext, ReactNode, useState, useCallback } from 'react'
import { CourseWithColleges as Course } from '@/types/domain'

/**
 * Course UI Context - Handles modal states and UI interactions
 * Separated from CourseContext to keep data and UI concerns separate
 */

interface CourseUIContextType {
  // Selected item
  selectedCourse: Course | null
  setSelectedCourse: (course: Course | null) => void

  // Modal states
  isViewModalOpen: boolean
  isEditModalOpen: boolean
  isDeleteModalOpen: boolean
  isAddModalOpen: boolean

  // Modal actions
  openViewModal: (course: Course) => void
  closeViewModal: () => void
  openEditModal: (course: Course) => void
  closeEditModal: () => void
  openDeleteModal: (course: Course) => void
  closeDeleteModal: () => void
  openAddModal: () => void
  closeAddModal: () => void

  // Utility
  closeAllModals: () => void
}

const CourseUIContext = createContext<CourseUIContextType | undefined>(undefined)

interface CourseUIProviderProps {
  children: ReactNode
}

export function CourseUIProvider({ children }: CourseUIProviderProps) {
  // Selected item state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Modal action handlers
  const openViewModal = useCallback((course: Course) => {
    setSelectedCourse(course)
    setIsViewModalOpen(true)
  }, [])

  const closeViewModal = useCallback(() => {
    setIsViewModalOpen(false)
    setSelectedCourse(null)
  }, [])

  const openEditModal = useCallback((course: Course) => {
    setSelectedCourse(course)
    setIsEditModalOpen(true)
  }, [])

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false)
    setSelectedCourse(null)
  }, [])

  const openDeleteModal = useCallback((course: Course) => {
    setSelectedCourse(course)
    setIsDeleteModalOpen(true)
  }, [])

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false)
    setSelectedCourse(null)
  }, [])

  const openAddModal = useCallback(() => {
    setIsAddModalOpen(true)
  }, [])

  const closeAddModal = useCallback(() => {
    setIsAddModalOpen(false)
  }, [])

  const closeAllModals = useCallback(() => {
    setIsViewModalOpen(false)
    setIsEditModalOpen(false)
    setIsDeleteModalOpen(false)
    setIsAddModalOpen(false)
    setSelectedCourse(null)
  }, [])

  const value: CourseUIContextType = {
    // Selected item
    selectedCourse,
    setSelectedCourse,

    // Modal states
    isViewModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isAddModalOpen,

    // Modal actions
    openViewModal,
    closeViewModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openAddModal,
    closeAddModal,

    // Utility
    closeAllModals,
  }

  return (
    <CourseUIContext.Provider value={value}>
      {children}
    </CourseUIContext.Provider>
  )
}

export function useCourseUIContext() {
  const context = useContext(CourseUIContext)
  if (context === undefined) {
    throw new Error('useCourseUIContext must be used within a CourseUIProvider')
  }
  return context
}

export default CourseUIContext
