import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export interface News {
  id: string
  title: string
  slug: string
  content: string
  active: boolean
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface NewsFormData {
  title: string
  slug: string
  content: string
  imageUrl?: string
  active?: boolean
}

interface NewsResponse {
  data: News[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Query keys for consistent cache management
export const newsKeys = {
  all: ['news'] as const,
  lists: () => [...newsKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...newsKeys.lists(), filters] as const,
  details: () => [...newsKeys.all, 'detail'] as const,
  detail: (id: string) => [...newsKeys.details(), id] as const,
}

// API functions
const fetchNews = async (limit: number = 10, skip: number = 0): Promise<NewsResponse> => {
  const page = Math.floor(skip / limit) + 1
  const response = await fetch(`/api/news?page=${page}&limit=${limit}`)
  if (!response.ok) {
    throw new Error('Failed to fetch news')
  }
  return response.json()
}

const fetchNewsItem = async (id: string): Promise<News> => {
  const response = await fetch(`/api/news/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch news')
  }
  return response.json()
}

const createNews = async (data: NewsFormData): Promise<News> => {
  const response = await fetch('/api/news', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create news')
  }
  
  return response.json()
}

const updateNews = async ({ id, data }: { id: string; data: Partial<NewsFormData> }): Promise<News> => {
  const response = await fetch(`/api/news/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update news')
  }
  
  return response.json()
}

const deleteNews = async (id: string): Promise<void> => {
  const response = await fetch(`/api/news/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete news')
  }
}

// Main hook
export function useAdminNews(limit: number = 10, skip: number = 0) {
  const queryClient = useQueryClient()

  // Fetch all news
  const {
    data: newsData = { data: [], pagination: { page: 1, limit, total: 0, totalPages: 0, hasNext: false, hasPrev: false } },
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: newsKeys.list({ limit, skip }),
    queryFn: () => fetchNews(limit, skip),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create news mutation
  const createNewsMutation = useMutation({
    mutationFn: createNews,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: newsKeys.lists() })
      const previous = queryClient.getQueryData(newsKeys.list({ limit, skip }))
      const optimistic = {
        id: `temp-${Date.now()}`,
        ...data,
        imageUrl: data.imageUrl || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      queryClient.setQueryData(newsKeys.list({ limit, skip }), (old: NewsResponse | undefined) => {
        if (!old) return old
        return {
          ...old,
          data: [optimistic as any, ...old.data],
          pagination: { ...old.pagination, total: old.pagination.total + 1 },
        }
      })
      return { previous, tempId: optimistic.id }
    },
    onSuccess: (newNews, _vars, context) => {
      toast.success('News created successfully')
      queryClient.setQueryData(newsKeys.list({ limit, skip }), (old: NewsResponse | undefined) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((n) => (n.id === context?.tempId ? newNews : n)),
        }
      })
    },
    onError: (error: Error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(newsKeys.list({ limit, skip }), context.previous)
      toast.error(error.message || 'Failed to create news')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.lists(), refetchType: 'active' })
    },
  })

  // Update news mutation
  const updateNewsMutation = useMutation({
    mutationFn: updateNews,
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: newsKeys.lists() })
      const previous = queryClient.getQueryData(newsKeys.list({ limit, skip }))
      queryClient.setQueryData(newsKeys.list({ limit, skip }), (old: NewsResponse | undefined) => {
        if (!old) return old
        return { ...old, data: old.data.map((n) => n.id === id ? { ...n, ...data } : n) }
      })
      return { previous }
    },
    onSuccess: () => {
      toast.success('News updated successfully')
    },
    onError: (error: Error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(newsKeys.list({ limit, skip }), context.previous)
      toast.error(error.message || 'Failed to update news')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.lists(), refetchType: 'active' })
      queryClient.invalidateQueries({ queryKey: newsKeys.details(), refetchType: 'active' })
    },
  })

  // Delete news mutation
  const deleteNewsMutation = useMutation({
    mutationFn: deleteNews,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: newsKeys.lists() })
      const previous = queryClient.getQueryData(newsKeys.list({ limit, skip }))
      queryClient.setQueryData(newsKeys.list({ limit, skip }), (old: NewsResponse | undefined) => {
        if (!old) return old
        return { ...old, data: old.data.filter((n) => n.id !== id), pagination: { ...old.pagination, total: old.pagination.total - 1 } }
      })
      return { previous }
    },
    onSuccess: () => {
      toast.success('News deleted successfully')
    },
    onError: (error: Error, _id, context) => {
      if (context?.previous) queryClient.setQueryData(newsKeys.list({ limit, skip }), context.previous)
      toast.error(error.message || 'Failed to delete news')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.lists(), refetchType: 'active' })
      queryClient.invalidateQueries({ queryKey: newsKeys.details(), refetchType: 'active' })
    },
  })

  const createNewsHandler = async (data: NewsFormData) => {
    await createNewsMutation.mutateAsync(data)
  }

  const updateNewsHandler = async (id: string, data: Partial<NewsFormData>) => {
    await updateNewsMutation.mutateAsync({ id, data })
  }

  const deleteNewsHandler = async (id: string) => {
    await deleteNewsMutation.mutateAsync(id)
  }

  return {
    news: newsData.data,
    total: newsData.pagination.total,
    limit: newsData.pagination.limit,
    skip: (newsData.pagination.page - 1) * newsData.pagination.limit,
    isLoading,
    error: error?.message || null,
    createNews: createNewsHandler,
    updateNews: updateNewsHandler,
    deleteNews: deleteNewsHandler,
    isCreating: createNewsMutation.isPending,
    isUpdating: updateNewsMutation.isPending,
    isDeleting: deleteNewsMutation.isPending,
    refetchNews: refetch,
  }
}

// Hook for single news item
export function useAdminNewsItem(id: string) {
  return useQuery({
    queryKey: newsKeys.detail(id),
    queryFn: () => fetchNewsItem(id),
    enabled: !!id,
  })
}