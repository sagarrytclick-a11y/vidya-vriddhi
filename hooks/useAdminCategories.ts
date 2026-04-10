import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useState, useCallback, useEffect } from 'react'

// Types
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

export interface CategoriesResponse {
  categories: Category[]
  pagination: PaginationInfo
}

export interface CreateCategoryData {
  name: string
  slug: string
  description?: string
  categoryImageUrl?: string
  active?: boolean
}

export interface UpdateCategoryData extends CreateCategoryData {
  id: string
}

// Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: { page: number; limit: number; search: string }) => 
    [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
}

// API Functions
const fetchCategories = async (page: number, limit: number, search: string): Promise<CategoriesResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search
  })
  const response = await fetch(`/api/categories?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }
  return response.json()
}

const createCategoryApi = async (data: CreateCategoryData): Promise<Category> => {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error || 'Failed to create category')
  }
  return result
}

const updateCategoryApi = async (data: UpdateCategoryData): Promise<Category> => {
  const { id, ...rest } = data
  const response = await fetch(`/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rest),
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error || 'Failed to update category')
  }
  return result
}

const deleteCategoryApi = async (id: string): Promise<void> => {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error || 'Failed to delete category')
  }
}

// Custom Hook
export function useAdminCategories() {
  const queryClient = useQueryClient()
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modal State
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // React Query - Fetch Categories
  const queryKey = categoryKeys.list({ page: currentPage, limit, search: searchTerm })
  
  console.log('🔍 React Query - queryKey:', queryKey)
  
  const { 
    data, 
    isLoading, 
    error,
    refetch,
    isFetching,
    status
  } = useQuery({
    queryKey,
    queryFn: async () => {
      console.log('🚀 React Query - fetching categories...', { currentPage, limit, searchTerm })
      const result = await fetchCategories(currentPage, limit, searchTerm)
      console.log('✅ React Query - fetched:', result)
      return result
    },
    staleTime: 0, // Always consider data stale to avoid cache issues
    gcTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 2,
  })
  
  console.log('📊 React Query - status:', status, 'isLoading:', isLoading, 'isFetching:', isFetching, 'data:', data)

  // Direct fetch fallback state
  const [directCategories, setDirectCategories] = useState<Category[]>([])
  const [directLoading, setDirectLoading] = useState(false)

  // Fallback useEffect - fetches directly if React Query fails or has no data
  useEffect(() => {
    const fetchDirect = async () => {
      // Only fetch if React Query has no data and isn't already loading
      if (!data && !isLoading && !isFetching) {
        console.log('⚠️ React Query has no data, using direct fetch fallback...')
        setDirectLoading(true)
        try {
          const result = await fetchCategories(currentPage, limit, searchTerm)
          console.log('✅ Direct fetch result:', result)
          setDirectCategories(result.categories)
        } catch (err) {
          console.error('❌ Direct fetch failed:', err)
        } finally {
          setDirectLoading(false)
        }
      }
    }

    fetchDirect()
  }, [data, isLoading, isFetching, currentPage, limit, searchTerm])

  // Use React Query data if available, otherwise use direct fetch
  const categories = data?.categories?.length ? data.categories : directCategories
  const finalIsLoading = isLoading || (isFetching && !data) || directLoading
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: directCategories.length,
    totalPages: Math.ceil(directCategories.length / limit),
    hasNext: false,
    hasPrev: false
  }

  // Mutations
  const createMutation = useMutation({
    mutationFn: createCategoryApi,
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      toast.success('Category created successfully!')
      setIsAddModalOpen(false)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create category')
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      toast.success('Category updated successfully!')
      setIsEditModalOpen(false)
      setSelectedCategory(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update category')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      toast.success('Category deleted successfully!')
      setIsDeleteModalOpen(false)
      setSelectedCategory(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete category')
    },
  })

  // Modal Actions
  const openViewModal = useCallback((category: Category) => {
    setSelectedCategory(category)
    setIsViewModalOpen(true)
  }, [])

  const closeViewModal = useCallback(() => {
    setIsViewModalOpen(false)
    setSelectedCategory(null)
  }, [])

  const openEditModal = useCallback((category: Category) => {
    setSelectedCategory(category)
    setIsEditModalOpen(true)
  }, [])

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false)
    setSelectedCategory(null)
  }, [])

  const openDeleteModal = useCallback((category: Category) => {
    setSelectedCategory(category)
    setIsDeleteModalOpen(true)
  }, [])

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false)
    setSelectedCategory(null)
  }, [])

  const openAddModal = useCallback(() => {
    setIsAddModalOpen(true)
  }, [])

  const closeAddModal = useCallback(() => {
    setIsAddModalOpen(false)
  }, [])

  // Pagination Actions
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit)
    setCurrentPage(1)
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }, [])

  return {
    // Data
    categories,
    pagination,
    isLoading: finalIsLoading,
    error: error?.message || null,
    
    // Pagination
    currentPage,
    limit,
    searchTerm,
    handlePageChange,
    handleLimitChange,
    handleSearchChange,
    
    // Mutations
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    deleteCategory: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Modal State
    selectedCategory,
    isViewModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isAddModalOpen,
    
    // Modal Actions
    openViewModal,
    closeViewModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openAddModal,
    closeAddModal,
    
    // Refetch
    refetch,
  }
}
