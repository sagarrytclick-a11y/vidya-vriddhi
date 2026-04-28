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
  blogs: Blog[]
  total: number
  limit: number
  skip: number
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
  const response = await fetch(`/api/blogs?limit=${limit}&skip=${skip}`)
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
    data: blogData = { blogs: [], total: 0, limit, skip },
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: blogKeys.list({ limit, skip }),
    queryFn: () => fetchBlogs(limit, skip),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create blog mutation
  const createBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      toast.success('Blog created successfully')
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create blog')
    },
  })

  // Update blog mutation
  const updateBlogMutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: () => {
      toast.success('Blog updated successfully')
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() })
      queryClient.invalidateQueries({ queryKey: blogKeys.details() })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update blog')
    },
  })

  // Delete blog mutation
  const deleteBlogMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      toast.success('Blog deleted successfully')
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() })
      queryClient.invalidateQueries({ queryKey: blogKeys.details() })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete blog')
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
    blogs: blogData.blogs,
    total: blogData.total,
    limit: blogData.limit,
    skip: blogData.skip,
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
