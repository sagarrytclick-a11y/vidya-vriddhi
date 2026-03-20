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

// Query keys for consistent cache management
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
}

// API functions
const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch('/api/categories')
  if (!response.ok) {
    throw new Error('Failed to fetch categories')
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

export function useCategories() {
  const queryClient = useQueryClient()

  const {
    data: categories = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
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
    mutationFn: updateCategory,
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
    mutationFn: deleteCategory,
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

  return {
    // Data
    categories,
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
