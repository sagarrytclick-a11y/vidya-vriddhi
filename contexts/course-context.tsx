'use client'

import { createContext, useContext, ReactNode, useState } from 'react'
import { useAdminCourses } from '@/hooks/useAdminCourses'
import { CourseWithColleges as Course, CourseFormData } from '@/types/domain'

/**
 * Course Context - Handles data fetching and mutations only
 * UI/Modal state has been separated into CourseUIContext
 */

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
  setLimit: (limit: number) => void
  limit: number
  page: number

  // Mutations
  createCourse: (data: CourseFormData) => Promise<void>
  updateCourse: (id: string, data: Partial<CourseFormData>) => Promise<void>
  deleteCourse: (id: string) => Promise<void>

  // Loading states
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean

  // Refetch
  refetchCourses: () => Promise<any>
}

const CourseContext = createContext<CourseContextType | undefined>(undefined)

interface CourseProviderProps {
  children: ReactNode
}

export function CourseProvider({ children }: CourseProviderProps) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

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

  const value: CourseContextType = {
    // Data
    courses,
    isLoading,
    error,
    pagination,

    // Pagination actions
    setPage,
    setLimit,
    limit,
    page,

    // Mutations
    createCourse,
    updateCourse,
    deleteCourse,

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,

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
