'use client'

import { createContext, useContext, ReactNode, useState } from 'react'
import { useAdminExams, ExamFormData } from '@/hooks/useAdminExams'
import { Pagination } from '@/types/api'

interface Exam {
  id: string
  name: string
  shortName: string
  slug: string
  description?: string
  type: string
  mode: string
  frequency: string
  status: string
  conductingBody: string
  createdAt: string
  updatedAt: string
  active: boolean
  examImageurl?: string
  heroSection?: any
  overview?: any
  registration?: any
  examPattern?: any
  examDates?: any
  resultStatistics?: any
  colleges?: any[]
}

interface ExamContextType {
  // Data
  exams: Exam[]
  isLoading: boolean
  error: string | null

  // Mutations
  createExam: (data: ExamFormData) => Promise<void>
  updateExam: (id: string, data: Partial<ExamFormData>) => Promise<void>
  deleteExam: (id: string) => Promise<void>

  // Loading states
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean

  // Modal state
  selectedExam: Exam | null
  setSelectedExam: (exam: Exam | null) => void
  isViewModalOpen: boolean
  setIsViewModalOpen: (open: boolean) => void
  isEditModalOpen: boolean
  setIsEditModalOpen: (open: boolean) => void
  isDeleteModalOpen: boolean
  setIsDeleteModalOpen: (open: boolean) => void
  isAddModalOpen: boolean
  setIsAddModalOpen: (open: boolean) => void

  // Modal actions
  openViewModal: (exam: Exam) => void
  closeViewModal: () => void
  openEditModal: (exam: Exam) => void
  closeEditModal: () => void
  openDeleteModal: (exam: Exam) => void
  closeDeleteModal: () => void
  openAddModal: () => void
  closeAddModal: () => void

  // Refetch
  refetchExams: () => Promise<any>

  // Pagination
  pagination: Pagination | null
  page: number
  setPage: (page: number) => void
  limit: number
  setLimit: (limit: number) => void
}

const ExamContext = createContext<ExamContextType | undefined>(undefined)

interface ExamProviderProps {
  children: ReactNode
}

export function ExamProvider({ children }: ExamProviderProps) {
  const {
    exams,
    isLoading,
    error,
    createExam,
    updateExam,
    deleteExam,
    isCreating,
    isUpdating,
    isDeleting,
    refetchExams,
    pagination,
    page,
    setPage,
    limit,
    setLimit,
  } = useAdminExams()

  // Modal state
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Modal actions
  const openViewModal = (exam: Exam) => {
    setSelectedExam(exam)
    setIsViewModalOpen(true)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedExam(null)
  }

  const openEditModal = (exam: Exam) => {
    setSelectedExam(exam)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedExam(null)
  }

  const openDeleteModal = (exam: Exam) => {
    setSelectedExam(exam)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedExam(null)
  }

  const openAddModal = () => {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  const value: ExamContextType = {
    // Data
    exams,
    isLoading,
    error,

    // Mutations
    createExam,
    updateExam,
    deleteExam,

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,

    // Modal state
    selectedExam,
    setSelectedExam,
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
    refetchExams,

    // Pagination
    pagination,
    page,
    setPage,
    limit,
    setLimit,
  }

  return (
    <ExamContext.Provider value={value}>
      {children}
    </ExamContext.Provider>
  )
}

export function useExamContext() {
  const context = useContext(ExamContext)
  if (context === undefined) {
    throw new Error('useExamContext must be used within an ExamProvider')
  }
  return context
}
