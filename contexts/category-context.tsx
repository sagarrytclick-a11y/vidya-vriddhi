'use client'

import React, { createContext, useContext, ReactNode, useState } from 'react'
import { useCategories, CreateCategoryData, UpdateCategoryData } from '@/hook/useCategories'
import { CategoryFormData } from '@/components/admin/categories/add-category-modal'

export type { CategoryFormData }

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  active: boolean
  categoryImageUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface CategoryContextType {
  // Data
  categories: Category[]
  loading: boolean
  error: string | null
  pagination: PaginationInfo

  // Pagination state
  currentPage: number
  setCurrentPage: (page: number) => void
  limit: number
  setLimit: (limit: number) => void
  searchTerm: string
  setSearchTerm: (term: string) => void

  // Mutations
  createCategory: (data: CreateCategoryData) => Promise<Category>
  updateCategory: (data: UpdateCategoryData) => Promise<Category>
  deleteCategory: (id: string) => Promise<void>

  // Loading states
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean

  // Modal state
  selectedCategory: Category | null
  setSelectedCategory: (category: Category | null) => void
  isViewModalOpen: boolean
  setIsViewModalOpen: (open: boolean) => void
  isEditModalOpen: boolean
  setIsEditModalOpen: (open: boolean) => void
  isDeleteModalOpen: boolean
  setIsDeleteModalOpen: (open: boolean) => void
  isAddModalOpen: boolean
  setIsAddModalOpen: (open: boolean) => void

  // Modal actions
  openViewModal: (category: Category) => void
  closeViewModal: () => void
  openEditModal: (category: Category) => void
  closeEditModal: () => void
  openDeleteModal: (category: Category) => void
  closeDeleteModal: () => void
  openAddModal: () => void
  closeAddModal: () => void

  // Refetch
  refetchCategories: () => Promise<any>
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined)

export function CategoryProvider({ children }: { children: ReactNode }) {
  // Modal state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  // Use custom hook for data fetching
  const {
    categories,
    pagination,
    isLoading: loading,
    error,
    refetch: refetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting
  } = useCategories(currentPage, limit, searchTerm)

  // Modal actions
  const openViewModal = (category: Category) => {
    setSelectedCategory(category)
    setIsViewModalOpen(true)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedCategory(null)
  }

  const openEditModal = (category: Category) => {
    setSelectedCategory(category)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedCategory(null)
  }

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedCategory(null)
  }

  const openAddModal = () => {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  return (
    <CategoryContext.Provider
      value={{
        // Data
        categories,
        loading,
        error: error ? error.message : null,
        pagination,

        // Pagination state
        currentPage,
        setCurrentPage,
        limit,
        setLimit,
        searchTerm,
        setSearchTerm,

        // Mutations
        createCategory,
        updateCategory,
        deleteCategory,

        // Loading states
        isCreating,
        isUpdating,
        isDeleting,

        // Modal state
        selectedCategory,
        setSelectedCategory,
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
        refetchCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategoryContext() {
  const context = useContext(CategoryContext)
  if (context === undefined) {
    throw new Error('useCategoryContext must be used within a CategoryProvider')
  }
  return context
}
