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

// Query keys for consistent cache management
export const newsKeys = {
  all: ['news'] as const,
  lists: () => [...newsKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...newsKeys.lists(), filters] as const,
  details: () => [...newsKeys.all, 'detail'] as const,
  detail: (id: string) => [...newsKeys.details(), id] as const,
}

// API functions
const fetchNews = async (): Promise<News[]> => {
  const response = await fetch('/api/news')
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
export function useAdminNews() {
  const queryClient = useQueryClient()

  // Fetch all news
  const {
    data: news = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: newsKeys.lists(),
    queryFn: fetchNews,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create news mutation
  const createNewsMutation = useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      toast.success('News created successfully')
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create news')
    },
  })

  // Update news mutation
  const updateNewsMutation = useMutation({
    mutationFn: updateNews,
    onSuccess: () => {
      toast.success('News updated successfully')
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: newsKeys.details() })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update news')
    },
  })

  // Delete news mutation
  const deleteNewsMutation = useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      toast.success('News deleted successfully')
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: newsKeys.details() })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete news')
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
    news,
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
