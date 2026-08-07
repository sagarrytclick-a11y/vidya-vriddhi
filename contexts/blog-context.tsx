'use client'

import React, { createContext, useContext, ReactNode, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export interface Blog {
  id: string
  title: string
  slug: string
  content: string
  active: boolean
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

// Query keys for consistent cache management
export const blogKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...blogKeys.lists(), filters] as const,
  details: () => [...blogKeys.all, 'detail'] as const,
  detail: (id: string) => [...blogKeys.details(), id] as const,
}

interface BlogContextType {
  // Data
  blogs: Blog[]
  total: number
  limit: number
  skip: number
  loading: boolean
  error: string | null

  // Mutations
  createBlog: (data: BlogFormData) => Promise<void>
  updateBlog: (id: string, data: Partial<BlogFormData>) => Promise<void>
  deleteBlog: (id: string) => Promise<void>

  // Loading states
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean

  // Modal state
  selectedBlog: Blog | null
  setSelectedBlog: (blog: Blog | null) => void
  isViewModalOpen: boolean
  setIsViewModalOpen: (open: boolean) => void
  isEditModalOpen: boolean
  setIsEditModalOpen: (open: boolean) => void
  isDeleteModalOpen: boolean
  setIsDeleteModalOpen: (open: boolean) => void
  isAddModalOpen: boolean
  setIsAddModalOpen: (open: boolean) => void

  // Modal actions
  openViewModal: (blog: Blog) => void
  closeViewModal: () => void
  openEditModal: (blog: Blog) => void
  closeEditModal: () => void
  openDeleteModal: (blog: Blog) => void
  closeDeleteModal: () => void
  openAddModal: () => void
  closeAddModal: () => void

  // Refetch
  refetchBlogs: () => Promise<any>
}

const BlogContext = createContext<BlogContextType | undefined>(undefined)

// API functions
const fetchBlogs = async (limit: number = 10, skip: number = 0): Promise<{ data: Blog[], pagination: { page: number, limit: number, total: number, totalPages: number, hasNext: boolean, hasPrev: boolean } }> => {
  const page = Math.floor(skip / limit) + 1
  const response = await fetch(`/api/blogs?page=${page}&limit=${limit}`)
  if (!response.ok) {
    throw new Error('Failed to fetch blogs')
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

// Provider component
export function BlogProvider({ children, limit = 10, skip = 0 }: { children: ReactNode, limit?: number, skip?: number }) {
  const queryClient = useQueryClient()

  // Modal state
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Fetch all blogs
  const {
    data: blogData = { data: [], pagination: { page: 1, limit, total: 0, totalPages: 0, hasNext: false, hasPrev: false } },
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
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: blogKeys.lists() })
      const previous = queryClient.getQueryData(blogKeys.list({ limit, skip }))
      const optimistic = {
        id: `temp-${Date.now()}`,
        title: data.title,
        slug: data.slug,
        content: data.content,
        active: data.active ?? false,
        imageUrl: data.imageUrl || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      queryClient.setQueryData(blogKeys.list({ limit, skip }), (old: any) => {
        if (!old) return old
        return {
          ...old,
          data: [optimistic, ...old.data],
          pagination: { ...old.pagination, total: old.pagination.total + 1 },
        }
      })
      return { previous, tempId: optimistic.id }
    },
    onSuccess: (newBlog: any, _vars, context) => {
      toast.success('Blog created successfully')
      queryClient.setQueryData(blogKeys.list({ limit, skip }), (old: any) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((b: Blog) => (b.id === context?.tempId ? newBlog : b)),
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
      queryClient.setQueryData(blogKeys.list({ limit, skip }), (old: any) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((b: Blog) => (b.id === id ? { ...b, ...data } : b)),
        }
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
    },
  })

  // Delete blog mutation
  const deleteBlogMutation = useMutation({
    mutationFn: deleteBlog,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: blogKeys.lists() })
      const previous = queryClient.getQueryData(blogKeys.list({ limit, skip }))
      queryClient.setQueryData(blogKeys.list({ limit, skip }), (old: any) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.filter((b: Blog) => b.id !== id),
          pagination: { ...old.pagination, total: Math.max(0, old.pagination.total - 1) },
        }
      })
      return { previous }
    },
    onSuccess: () => {
      toast.success('Blog deleted successfully')
    },
    onError: (error: Error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(blogKeys.list({ limit, skip }), context.previous)
      toast.error(error.message || 'Failed to delete blog')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists(), refetchType: 'active' })
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

  // Modal actions
  const openViewModal = (blog: Blog) => {
    setSelectedBlog(blog)
    setIsViewModalOpen(true)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedBlog(null)
  }

  const openEditModal = (blog: Blog) => {
    setSelectedBlog(blog)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedBlog(null)
  }

  const openDeleteModal = (blog: Blog) => {
    setSelectedBlog(blog)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedBlog(null)
  }

  const openAddModal = () => {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  const value: BlogContextType = {
    // Data
    blogs: blogData.data,
    total: blogData.pagination.total,
    limit: blogData.pagination.limit,
    skip: (blogData.pagination.page - 1) * blogData.pagination.limit,
    loading,
    error: error?.message || null,

    // Mutations
    createBlog: createBlogHandler,
    updateBlog: updateBlogHandler,
    deleteBlog: deleteBlogHandler,

    // Loading states
    isCreating: createBlogMutation.isPending,
    isUpdating: updateBlogMutation.isPending,
    isDeleting: deleteBlogMutation.isPending,

    // Modal state
    selectedBlog,
    setSelectedBlog,
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
    refetchBlogs: refetch,
  }

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>
}

// Hook to use the blog context
export function useBlogContext() {
  const context = useContext(BlogContext)
  if (context === undefined) {
    throw new Error('useBlogContext must be used within a BlogProvider')
  }
  return context
}

// Form data type (used in modals)
export interface BlogFormData {
  title: string
  slug: string
  content: string
  category: string
  imageUrl?: string
  active?: boolean
}
