'use client'

import { createContext, useContext, ReactNode, useMemo, useState } from 'react'
import { useAdminCountries } from '@/hooks/useAdminCountries'
import { Country, CreateCountryData, UpdateCountryData } from '@/hooks/useAdminCountries'

interface CountryContextType {
  // Data
  countries: Country[]
  allCountriesCount: number
  search: string
  setSearch: (search: string) => void
  isLoading: boolean
  error: Error | null

  // Mutations
  createCountry: (data: CreateCountryData) => Promise<Country>
  updateCountry: (data: UpdateCountryData) => Promise<Country>
  deleteCountry: (id: string) => Promise<void>

  // Loading states
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean

  // Modal state
  selectedCountry: Country | null
  setSelectedCountry: (country: Country | null) => void
  isViewModalOpen: boolean
  setIsViewModalOpen: (open: boolean) => void
  isEditModalOpen: boolean
  setIsEditModalOpen: (open: boolean) => void
  isDeleteModalOpen: boolean
  setIsDeleteModalOpen: (open: boolean) => void
  isAddModalOpen: boolean
  setIsAddModalOpen: (open: boolean) => void

  // Modal actions
  openViewModal: (country: Country) => void
  closeViewModal: () => void
  openEditModal: (country: Country) => void
  closeEditModal: () => void
  openDeleteModal: (country: Country) => void
  closeDeleteModal: () => void
  openAddModal: () => void
  closeAddModal: () => void
}

const CountryContext = createContext<CountryContextType | undefined>(undefined)

interface CountryProviderProps {
  children: ReactNode
}

export function CountryProvider({ children }: CountryProviderProps) {
  const {
    countries,
    isLoading,
    error,
    createCountry,
    updateCountry,
    deleteCountry,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdminCountries()

  const [search, setSearch] = useState('')
  const filteredCountries = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return countries
    return countries.filter((country) => {
      const hay = `${country.name} ${country.slug} ${country.description || ''}`.toLowerCase()
      return hay.includes(q)
    })
  }, [countries, search])

  // Modal state
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Modal actions
  const openViewModal = (country: Country) => {
    setSelectedCountry(country)
    setIsViewModalOpen(true)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedCountry(null)
  }

  const openEditModal = (country: Country) => {
    setSelectedCountry(country)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedCountry(null)
  }

  const openDeleteModal = (country: Country) => {
    setSelectedCountry(country)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedCountry(null)
  }

  const openAddModal = () => {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  const value: CountryContextType = {
    // Data
    countries: filteredCountries,
    allCountriesCount: countries.length,
    search,
    setSearch,
    isLoading,
    error,

    // Mutations
    createCountry,
    updateCountry,
    deleteCountry,

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,

    // Modal state
    selectedCountry,
    setSelectedCountry,
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
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  )
}

export function useCountryContext() {
  const context = useContext(CountryContext)
  if (context === undefined) {
    throw new Error('useCountryContext must be used within a CountryProvider')
  }
  return context
}
