import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Category } from '@/contexts/category-context'

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

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface CategoriesResponse {
  data: Category[]
  pagination: PaginationInfo
}

// Query keys for consistent cache management
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  count: () => [...categoryKeys.all, 'count'] as const,
}

// API functions
const fetchCategories = async ({ queryKey }: { queryKey: readonly unknown[] }): Promise<CategoriesResponse> => {
  const [, filters] = queryKey as [string, { page: number; limit: number; search: string }]
  const { page = 1, limit = 10, search = '' } = filters
  
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search
  })
  const url = `/api/categories?${params}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

const createCategory = async (categoryData: CreateCategoryData): Promise<Category> => {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categoryData),
  })

  const data = await response.json()

  if (!response.ok) {
    if (data.fieldErrors) {
      const errorMessage = Object.values(data.fieldErrors).join(', ')
      throw new Error(errorMessage)
    }
    throw new Error(data.error || 'Failed to create category')
  }

  return data
}

const updateCategory = async ({ id, ...categoryData }: UpdateCategoryData): Promise<Category> => {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categoryData),
  })

  const data = await response.json()

  if (!response.ok) {
    if (data.fieldErrors) {
      const errorMessage = Object.values(data.fieldErrors).join(', ')
      throw new Error(errorMessage)
    }
    throw new Error(data.error || 'Failed to update category')
  }

  return data
}

const deleteCategory = async (id: string): Promise<void> => {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete category')
  }
}

const fetchCategoryCount = async (): Promise<number> => {
  const url = '/api/categories?page=1&limit=1'
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch category count: ${response.status}`)
  }

  const data = await response.json()
  return data.pagination?.total || 0
}

export function useCategories(page: number = 1, limit: number = 10, search: string = '') {
  const queryClient = useQueryClient()

  const {
    data: categoriesData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: categoryKeys.list({ page, limit, search }),
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: 'always',
    retry: 3,
  })


  const categories = categoriesData?.data || []
  const pagination = categoriesData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  }

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (newCategory) => {
      queryClient.setQueryData(categoryKeys.list({ page, limit, search }), (oldData: CategoriesResponse | undefined) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: [newCategory, ...oldData.data],
          pagination: {
            ...oldData.pagination,
            total: oldData.pagination.total + 1
          }
        }
      })
      toast.success('Category created successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create category')
    },
  })

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData(categoryKeys.list({ page, limit, search }), (oldData: CategoriesResponse | undefined) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: oldData.data.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category
          )
        }
      })
      toast.success('Category updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update category')
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(categoryKeys.list({ page, limit, search }), (oldData: CategoriesResponse | undefined) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: oldData.data.filter((category) => category.id !== deletedId),
          pagination: {
            ...oldData.pagination,
            total: oldData.pagination.total - 1
          }
        }
      })
      toast.success('Category deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete category')
    },
  })

  return {
    // Data
    categories,
    pagination,
    isLoading: loading,
    error,

    // Actions
    refetch,

    // Mutations
    createCategory: createCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,

    // Loading states
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  }
}

export function useCategoryCount() {
  const {
    data: count,
    isLoading,
    error,
  } = useQuery({
    queryKey: categoryKeys.count(),
    queryFn: fetchCategoryCount,
    staleTime: 5 * 60 * 1000, // 5  minutes
    refetchOnMount: 'always',
    retry: 3,
  })

  return {
    count: count || 0,
    isLoading,
    error,
  }
}

