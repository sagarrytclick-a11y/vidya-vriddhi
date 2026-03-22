'use client'

import React, { createContext, useContext, ReactNode, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
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

// Query keys for consistent cache management
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
}

interface CategoryContextType {
  // Data
  categories: Category[]
  loading: boolean
  error: string | null

  // Mutations
  createCategory: (data: CategoryFormData) => Promise<void>
  updateCategory: (id: string, data: Partial<CategoryFormData>) => Promise<void>
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

// API functions
const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch('/api/categories')
  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }
  return response.json()
}

const createCategoryApi = async (data: CategoryFormData): Promise<Category> => {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const responseData = await response.json()

  if (!response.ok) {
    throw new Error(responseData.error || 'Failed to create category')
  }

  return responseData
}

const updateCategoryApi = async ({ id, data }: { id: string; data: Partial<CategoryFormData> }): Promise<Category> => {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const responseData = await response.json()

  if (!response.ok) {
    throw new Error(responseData.error || 'Failed to update category')
  }

  return responseData
}

const deleteCategoryApi = async (id: string): Promise<void> => {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const responseData = await response.json()
    throw new Error(responseData.error || 'Failed to delete category')
  }
}

export function CategoryProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  // Modal state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const {
    data: categories = [],
    isLoading: loading,
    error,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const createCategoryMutation = useMutation({
    mutationFn: createCategoryApi,
    onSuccess: (newCategory) => {
      queryClient.setQueryData(categoryKeys.lists(), (oldCategories: Category[] = []) => [
        newCategory,
        ...oldCategories,
      ])
      toast.success('Category created successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create category')
    },
  })

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategoryApi,
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData(categoryKeys.lists(), (oldCategories: Category[] = []) =>
        oldCategories.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category
        )
      )
      toast.success('Category updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update category')
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(categoryKeys.lists(), (oldCategories: Category[] = []) =>
        oldCategories.filter((category) => category.id !== deletedId)
      )
      toast.success('Category deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete category')
    },
  })

  const createCategory = async (data: CategoryFormData) => {
    await createCategoryMutation.mutateAsync(data)
  }

  const updateCategory = async (id: string, data: Partial<CategoryFormData>) => {
    await updateCategoryMutation.mutateAsync({ id, data })
  }

  const deleteCategory = async (id: string) => {
    await deleteCategoryMutation.mutateAsync(id)
  }

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
        error: error ? (error as Error).message : null,

        // Mutations
        createCategory,
        updateCategory,
        deleteCategory,

        // Loading states
        isCreating: createCategoryMutation.isPending,
        isUpdating: updateCategoryMutation.isPending,
        isDeleting: deleteCategoryMutation.isPending,

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
