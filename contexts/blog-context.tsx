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
const fetchBlogs = async (): Promise<Blog[]> => {
  const response = await fetch('/api/blogs')
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
export function BlogProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  // Modal state
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Fetch all blogs
  const {
    data: blogs = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: blogKeys.lists(),
    queryFn: fetchBlogs,
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
    blogs,
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
  imageUrl?: string
  active?: boolean
}
