import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  active: boolean
  createdAt: string
  updatedAt: string
  imageUrl: string | null
}

interface BlogFormData {
  title: string
  slug: string
  content: string
  category: string
  imageUrl?: string
  active?: boolean
}

interface BlogsResponse {
  data: Blog[]
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
export const blogKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...blogKeys.lists(), filters] as const,
  details: () => [...blogKeys.all, 'detail'] as const,
  detail: (id: string) => [...blogKeys.details(), id] as const,
}

// API functions
const fetchBlogs = async (limit: number = 10, skip: number = 0): Promise<BlogsResponse> => {
  const page = Math.floor(skip / limit) + 1
  const response = await fetch(`/api/blogs?page=${page}&limit=${limit}`)
  if (!response.ok) {
    throw new Error('Failed to fetch blogs')
  }
  return response.json()
}

const fetchBlog = async (id: string): Promise<Blog> => {
  const response = await fetch(`/api/blogs/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch blog')
  }
  return response.json()
}

const createBlog = async (data: BlogFormData): Promise<Blog> => {
  const response = await fetch('/api/blogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create blog')
  }
  
  return response.json()
}

const updateBlog = async ({ id, data }: { id: string; data: Partial<BlogFormData> }): Promise<Blog> => {
  const response = await fetch(`/api/blogs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update blog')
  }
  
  return response.json()
}

const deleteBlog = async (id: string): Promise<void> => {
  const response = await fetch(`/api/blogs/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete blog')
  }
}

// Main hook for admin with pagination
export function useAdminBlogs(limit: number = 10, skip: number = 0) {
  const queryClient = useQueryClient()

  // Fetch blogs with pagination
  const {
    data: blogData = { data: [], pagination: { page: 1, limit, total: 0, totalPages: 0, hasNext: false, hasPrev: false } },
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: blogKeys.list({ limit, skip }),
    queryFn: () => fetchBlogs(limit, skip),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create blog mutation
  const createBlogMutation = useMutation({
    mutationFn: createBlog,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: blogKeys.lists() })
      const previous = queryClient.getQueryData(blogKeys.list({ limit, skip }))
      const optimistic = {
        id: `temp-${Date.now()}`,
        ...data,
        imageUrl: data.imageUrl || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      queryClient.setQueryData(blogKeys.list({ limit, skip }), (old: BlogsResponse | undefined) => {
        if (!old) return old
        return {
          ...old,
          data: [optimistic as any, ...old.data],
          pagination: { ...old.pagination, total: old.pagination.total + 1 },
        }
      })
      return { previous, tempId: optimistic.id }
    },
    onSuccess: (newBlog, _vars, context) => {
      toast.success('Blog created successfully')
      queryClient.setQueryData(blogKeys.list({ limit, skip }), (old: BlogsResponse | undefined) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((b) => (b.id === context?.tempId ? newBlog : b)),
        }
      })
    },
    onError: (error: Error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(blogKeys.list({ limit, skip }), context.previous)
      toast.error(error.message || 'Failed to create blog')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists(), refetchType: 'active' })
    },
  })

  // Update blog mutation
  const updateBlogMutation = useMutation({
    mutationFn: updateBlog,
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: blogKeys.lists() })
      const previous = queryClient.getQueryData(blogKeys.list({ limit, skip }))
      queryClient.setQueryData(blogKeys.list({ limit, skip }), (old: BlogsResponse | undefined) => {
        if (!old) return old
        return { ...old, data: old.data.map((b) => b.id === id ? { ...b, ...data } : b) }
      })
      return { previous }
    },
    onSuccess: () => {
      toast.success('Blog updated successfully')
    },
    onError: (error: Error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(blogKeys.list({ limit, skip }), context.previous)
      toast.error(error.message || 'Failed to update blog')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists(), refetchType: 'active' })
      queryClient.invalidateQueries({ queryKey: blogKeys.details(), refetchType: 'active' })
    },
  })

  // Delete blog mutation
  const deleteBlogMutation = useMutation({
    mutationFn: deleteBlog,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: blogKeys.lists() })
      const previous = queryClient.getQueryData(blogKeys.list({ limit, skip }))
      queryClient.setQueryData(blogKeys.list({ limit, skip }), (old: BlogsResponse | undefined) => {
        if (!old) return old
        return { ...old, data: old.data.filter((b) => b.id !== id), pagination: { ...old.pagination, total: old.pagination.total - 1 } }
      })
      return { previous }
    },
    onSuccess: () => {
      toast.success('Blog deleted successfully')
    },
    onError: (error: Error, _id, context) => {
      if (context?.previous) queryClient.setQueryData(blogKeys.list({ limit, skip }), context.previous)
      toast.error(error.message || 'Failed to delete blog')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists(), refetchType: 'active' })
      queryClient.invalidateQueries({ queryKey: blogKeys.details(), refetchType: 'active' })
    },
  })

  const createBlogHandler = async (data: BlogFormData) => {
    await createBlogMutation.mutateAsync(data)
  }

  const updateBlogHandler = async (id: string, data: Partial<BlogFormData>) => {
    await updateBlogMutation.mutateAsync({ id, data })
  }

  const deleteBlogHandler = async (id: string) => {
    await deleteBlogMutation.mutateAsync(id)
  }

  return {
    blogs: blogData.data,
    total: blogData.pagination.total,
    limit: blogData.pagination.limit,
    skip: (blogData.pagination.page - 1) * blogData.pagination.limit,
    loading,
    error: error?.message || null,
    createBlog: createBlogHandler,
    updateBlog: updateBlogHandler,
    deleteBlog: deleteBlogHandler,
    isCreating: createBlogMutation.isPending,
    isUpdating: updateBlogMutation.isPending,
    isDeleting: deleteBlogMutation.isPending,
    refetchBlogs: refetch,
  }
}

// Hook for single blog
export function useAdminBlog(id: string) {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: () => fetchBlog(id),
    enabled: !!id,
  })
}
