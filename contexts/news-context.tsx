'use client'

import { createContext, useContext, ReactNode, useState } from 'react'
import { useAdminNews, News, NewsFormData } from '@/hooks/useAdminNews'

interface NewsContextType {
  // Data
  news: News[]
  total: number
  limit: number
  skip: number
  isLoading: boolean
  error: string | null

  // Mutations
  createNews: (data: NewsFormData) => Promise<void>
  updateNews: (id: string, data: Partial<NewsFormData>) => Promise<void>
  deleteNews: (id: string) => Promise<void>

  // Loading states
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean

  // Modal state
  selectedNews: News | null
  setSelectedNews: (news: News | null) => void
  isViewModalOpen: boolean
  setIsViewModalOpen: (open: boolean) => void
  isEditModalOpen: boolean
  setIsEditModalOpen: (open: boolean) => void
  isDeleteModalOpen: boolean
  setIsDeleteModalOpen: (open: boolean) => void
  isAddModalOpen: boolean
  setIsAddModalOpen: (open: boolean) => void

  // Modal actions
  openViewModal: (news: News) => void
  closeViewModal: () => void
  openEditModal: (news: News) => void
  closeEditModal: () => void
  openDeleteModal: (news: News) => void
  closeDeleteModal: () => void
  openAddModal: () => void
  closeAddModal: () => void

  // Refetch
  refetchNews: () => Promise<any>
}

const NewsContext = createContext<NewsContextType | undefined>(undefined)

interface NewsProviderProps {
  children: ReactNode
  limit?: number
  skip?: number
}

export function NewsProvider({ children, limit = 10, skip = 0 }: NewsProviderProps) {
  const {
    news,
    total,
    limit: returnedLimit,
    skip: returnedSkip,
    isLoading,
    error,
    createNews,
    updateNews,
    deleteNews,
    isCreating,
    isUpdating,
    isDeleting,
    refetchNews,
  } = useAdminNews(limit, skip)

  // Modal state
  const [selectedNews, setSelectedNews] = useState<News | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Modal actions
  const openViewModal = (newsItem: News) => {
    setSelectedNews(newsItem)
    setIsViewModalOpen(true)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedNews(null)
  }

  const openEditModal = (newsItem: News) => {
    setSelectedNews(newsItem)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedNews(null)
  }

  const openDeleteModal = (newsItem: News) => {
    setSelectedNews(newsItem)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedNews(null)
  }

  const openAddModal = () => {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  const value: NewsContextType = {
    // Data
    news,
    total,
    limit,
    skip,
    isLoading,
    error,

    // Mutations
    createNews,
    updateNews,
    deleteNews,

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,

    // Modal state
    selectedNews,
    setSelectedNews,
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
    refetchNews,
  }

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  )
}

export function useNewsContext() {
  const context = useContext(NewsContext)
  if (context === undefined) {
    throw new Error('useNewsContext must be used within a NewsProvider')
  }
  return context
}
