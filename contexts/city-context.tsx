'use client'

import { createContext, useContext, ReactNode, useState } from 'react'
import { useAdminCities } from '@/hooks/useAdminCities'
import { City, CreateCityData, UpdateCityData } from '@/hooks/useAdminCities'

interface CityContextType {
  // Data
  cities: City[]
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }

  // Pagination actions
  setPage: (page: number) => void

  // Mutations
  createCity: (data: CreateCityData) => Promise<City>
  updateCity: ({ id, data }: { id: string; data: UpdateCityData }) => Promise<City>
  deleteCity: (id: string) => Promise<void>

  // Loading states
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean

  // Modal state
  selectedCity: City | null
  setSelectedCity: (city: City | null) => void
  isViewModalOpen: boolean
  setIsViewModalOpen: (open: boolean) => void
  isEditModalOpen: boolean
  setIsEditModalOpen: (open: boolean) => void
  isDeleteModalOpen: boolean
  setIsDeleteModalOpen: (open: boolean) => void
  isAddModalOpen: boolean
  setIsAddModalOpen: (open: boolean) => void

  // Modal actions
  openViewModal: (city: City) => void
  closeViewModal: () => void
  openEditModal: (city: City) => void
  closeEditModal: () => void
  openDeleteModal: (city: City) => void
  closeDeleteModal: () => void
  openAddModal: () => void
  closeAddModal: () => void
}

const CityContext = createContext<CityContextType | undefined>(undefined)

interface CityProviderProps {
  children: ReactNode
}

export function CityProvider({ children }: CityProviderProps) {
  const [page, setPage] = useState(1)
  const limit = 10

  const {
    cities,
    pagination,
    isLoading,
    error,
    createCity,
    updateCity,
    deleteCity,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdminCities(page, limit)

  // Modal state
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Modal actions
  const openViewModal = (city: City) => {
    setSelectedCity(city)
    setIsViewModalOpen(true)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedCity(null)
  }

  const openEditModal = (city: City) => {
    setSelectedCity(city)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedCity(null)
  }

  const openDeleteModal = (city: City) => {
    setSelectedCity(city)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedCity(null)
  }

  const openAddModal = () => {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  const value: CityContextType = {
    // Data
    cities,
    isLoading,
    error,
    pagination,

    // Pagination actions
    setPage,

    // Mutations
    createCity,
    updateCity,
    deleteCity,

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,

    // Modal state
    selectedCity,
    setSelectedCity,
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
  }

  return (
    <CityContext.Provider value={value}>
      {children}
    </CityContext.Provider>
  )
}

export function useCityContext() {
  const context = useContext(CityContext)
  if (context === undefined) {
    throw new Error('useCityContext must be used within a CityProvider')
  }
  return context
}
