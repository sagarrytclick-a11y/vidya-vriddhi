import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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

export const adminCategoryKeys = {
  all: ['admin-categories'] as const,
  lists: () => [...adminCategoryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...adminCategoryKeys.lists(), filters] as const,
}

const fetchCategories = async (
  page: number,
  limit: number,
  search: string
): Promise<CategoriesResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
  })
  const response = await fetch(`/api/categories?${params}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`)
  }
  return response.json()
}

const createCategory = async (categoryData: CreateCategoryData): Promise<Category> => {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoryData),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create category')
  }
  return data
}

const updateCategory = async ({ id, ...categoryData }: UpdateCategoryData): Promise<Category> => {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoryData),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update category')
  }
  return data
}

const deleteCategory = async (id: string): Promise<void> => {
  const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to delete category')
  }
}

export function useAdminCategories(page: number = 1, limit: number = 10, search: string = '') {
  const queryClient = useQueryClient()
  const listKey = adminCategoryKeys.list({ page, limit, search })

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: listKey,
    queryFn: () => fetchCategories(page, limit, search),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  })

  const categories = data?.data || []
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  }

  const createMutation = useMutation({
    mutationFn: createCategory,
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: adminCategoryKeys.lists() })
      const previous = queryClient.getQueryData<CategoriesResponse>(listKey)
      const optimistic: Category = {
        id: `temp-${Date.now()}`,
        name: newData.name,
        slug: newData.slug,
        description: newData.description || null,
        active: newData.active ?? true,
        categoryImageUrl: newData.categoryImageUrl || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      queryClient.setQueryData<CategoriesResponse>(listKey, (old) => {
        if (!old) {
          return {
            data: [optimistic],
            pagination: {
              page,
              limit,
              total: 1,
              totalPages: 1,
              hasNext: false,
              hasPrev: false,
            },
          }
        }
        return {
          ...old,
          data: [optimistic, ...old.data],
          pagination: { ...old.pagination, total: old.pagination.total + 1 },
        }
      })
      return { previous, tempId: optimistic.id }
    },
    onSuccess: (created, _vars, context) => {
      queryClient.setQueryData<CategoriesResponse>(listKey, (old) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((c) => (c.id === context?.tempId ? created : c)),
        }
      })
      toast.success('Category created!')
      queryClient.invalidateQueries({
        queryKey: adminCategoryKeys.lists(),
        refetchType: 'active',
      })
    },
    onError: (err: Error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listKey, context.previous)
      }
      toast.error(err.message || 'Failed to create category')
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: adminCategoryKeys.lists() })
      const previous = queryClient.getQueryData<CategoriesResponse>(listKey)
      queryClient.setQueryData<CategoriesResponse>(listKey, (old) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((c) =>
            c.id === vars.id
              ? {
                  ...c,
                  ...vars,
                  description: vars.description ?? c.description,
                  categoryImageUrl: vars.categoryImageUrl ?? c.categoryImageUrl,
                  updatedAt: new Date().toISOString(),
                }
              : c
          ),
        }
      })
      return { previous }
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<CategoriesResponse>(listKey, (old) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((c) => (c.id === updated.id ? updated : c)),
        }
      })
      toast.success('Category updated!')
    },
    onError: (err: Error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listKey, context.previous)
      }
      toast.error(err.message || 'Failed to update category')
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryKeys.lists(),
        refetchType: 'active',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: adminCategoryKeys.lists() })
      const previous = queryClient.getQueryData<CategoriesResponse>(listKey)
      queryClient.setQueryData<CategoriesResponse>(listKey, (old) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.filter((c) => c.id !== id),
          pagination: {
            ...old.pagination,
            total: Math.max(0, old.pagination.total - 1),
          },
        }
      })
      return { previous }
    },
    onSuccess: () => {
      toast.success('Category deleted')
    },
    onError: (err: Error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listKey, context.previous)
      }
      toast.error(err.message || 'Failed to delete category')
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryKeys.lists(),
        refetchType: 'active',
      })
    },
  })

  return {
    categories,
    pagination,
    isLoading,
    error: error ? error.message : null,
    refetch,
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
