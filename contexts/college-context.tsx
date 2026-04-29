'use client'

import { createContext, useContext, ReactNode, useState } from 'react'
import { useColleges } from '@/hooks/useColleges'
import { College, CollegeFormData } from '@/types/college'
import { Pagination } from '@/types/api'

interface CollegeContextType {
  // Data
  colleges: College[]
  isLoading: boolean
  error: string | null

  // Mutations
  createCollege: (data: CollegeFormData) => Promise<void>
  updateCollege: (id: string, data: CollegeFormData) => Promise<void>
  deleteCollege: (id: string) => Promise<void>

  // Loading states
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean

  // Modal state
  selectedCollege: College | null
  setSelectedCollege: (college: College | null) => void
  isViewModalOpen: boolean
  setIsViewModalOpen: (open: boolean) => void
  isEditModalOpen: boolean
  setIsEditModalOpen: (open: boolean) => void
  isDeleteModalOpen: boolean
  setIsDeleteModalOpen: (open: boolean) => void
  isAddModalOpen: boolean
  setIsAddModalOpen: (open: boolean) => void

  // Modal actions
  openViewModal: (college: College) => void
  closeViewModal: () => void
  openEditModal: (college: College) => Promise<void>
  closeEditModal: () => void
  openDeleteModal: (college: College) => void
  closeDeleteModal: () => void
  openAddModal: () => void
  closeAddModal: () => void

  // Refetch
  refetchColleges: () => Promise<any>

  // Pagination
  pagination: Pagination | null
  page: number
  setPage: (page: number) => void
  limit: number
  setLimit: (limit: number) => void
}

const CollegeContext = createContext<CollegeContextType | undefined>(undefined)

interface CollegeProviderProps {
  children: ReactNode
}

export function CollegeProvider({ children }: CollegeProviderProps) {
  const {
    colleges,
    isLoading,
    error,
    createCollege,
    updateCollege,
    deleteCollege,
    isCreating,
    isUpdating,
    isDeleting,
    refetchColleges,
    pagination,
    page,
    setPage,
    limit,
    setLimit,
  } = useColleges()

  // Modal state
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Modal actions
  const openViewModal = (college: College) => {
    setSelectedCollege(college)
    setIsViewModalOpen(true)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedCollege(null)
  }

  const openEditModal = async (college: College) => {
    try {
      // Fetch complete college data with all relations
      const response = await fetch(`/api/colleges/${college.id}`)
      if (response.ok) {
        const completeCollege = await response.json()
        setSelectedCollege(completeCollege)
        setIsEditModalOpen(true)
      } else {
        console.error('Failed to fetch complete college data')
        // Fallback to basic college data
        setSelectedCollege(college)
        setIsEditModalOpen(true)
      }
    } catch (error) {
      console.error('Error fetching college data:', error)
      // Fallback to basic college data
      setSelectedCollege(college)
      setIsEditModalOpen(true)
    }
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedCollege(null)
  }

  const openDeleteModal = (college: College) => {
    setSelectedCollege(college)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedCollege(null)
  }

  const openAddModal = () => {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  const value: CollegeContextType = {
    // Data
    colleges,
    isLoading,
    error,

    // Mutations
    createCollege,
    updateCollege,
    deleteCollege,

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,

    // Modal state
    selectedCollege,
    setSelectedCollege,
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
    refetchColleges,

    // Pagination
    pagination,
    page,
    setPage,
    limit,
    setLimit,
  }

  return (
    <CollegeContext.Provider value={value}>
      {children}
    </CollegeContext.Provider>
  )
}

export function useCollegeContext() {
  const context = useContext(CollegeContext)
  if (context === undefined) {
    throw new Error('useCollegeContext must be used within a CollegeProvider')
  }
  return context
}
