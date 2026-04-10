import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export interface City {
  id: string
  description: string | null
  cityImageURL: string | null
  features: string[]
  active: boolean
  countryId: string
  country?: {
    id: string
    name: string
    slug: string
    flagEmoji: string | null
  }
  createdAt: string
  updatedAt: string
}

export interface CreateCityData {
  description?: string
  cityImageURL?: string
  features?: string[]
  active?: boolean
  countryId: string
}

export interface UpdateCityData {
  description?: string
  cityImageURL?: string
  features?: string[]
  active?: boolean
  countryId?: string
}

const API_BASE = '/api'

// Query keys for consistent cache management
export const cityKeys = {
  all: ['cities'] as const,
  lists: () => [...cityKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...cityKeys.lists(), filters] as const,
  details: () => [...cityKeys.all, 'detail'] as const,
  detail: (id: string) => [...cityKeys.details(), id] as const,
}

async function fetchCities(): Promise<City[]> {
  const response = await fetch(`${API_BASE}/cities`)
  if (!response.ok) {
    throw new Error('Failed to fetch cities')
  }
  return response.json()
}

async function fetchCity(id: string): Promise<City> {
  const response = await fetch(`${API_BASE}/cities/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch city')
  }
  return response.json()
}

async function createCity(data: CreateCityData): Promise<City> {
  const response = await fetch(`${API_BASE}/cities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create city')
  }
  return response.json()
}

async function updateCity({ id, data }: { id: string; data: UpdateCityData }): Promise<City> {
  const response = await fetch(`${API_BASE}/cities/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update city')
  }
  return response.json()
}

async function deleteCity(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/cities/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete city')
  }
}

export function useAdminCities() {
  const queryClient = useQueryClient()

  const {
    data: cities = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: cityKeys.lists(),
    queryFn: fetchCities,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create city mutation
  const createCityMutation = useMutation({
    mutationFn: createCity,
    onSuccess: (newCity) => {
      toast.success('City created successfully')
      queryClient.setQueryData(cityKeys.lists(), (oldCities: City[] = []) => [
        newCity,
        ...oldCities,
      ])
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create city')
    },
  })

  // Update city mutation
  const updateCityMutation = useMutation({
    mutationFn: updateCity,
    onSuccess: (updatedCity) => {
      toast.success('City updated successfully')
      queryClient.setQueryData(cityKeys.lists(), (oldCities: City[] = []) =>
        oldCities.map((city) =>
          city.id === updatedCity.id ? updatedCity : city
        )
      )
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update city')
    },
  })

  // Delete city mutation
  const deleteCityMutation = useMutation({
    mutationFn: deleteCity,
    onSuccess: (_, deletedId) => {
      toast.success('City deleted successfully')
      queryClient.setQueryData(cityKeys.lists(), (oldCities: City[] = []) =>
        oldCities.filter((city) => city.id !== deletedId)
      )
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete city')
    },
  })

  return {
    cities,
    isLoading,
    error: error?.message || null,
    refetch,
    createCity: createCityMutation.mutateAsync,
    updateCity: updateCityMutation.mutateAsync,
    deleteCity: deleteCityMutation.mutateAsync,
    isCreating: createCityMutation.isPending,
    isUpdating: updateCityMutation.isPending,
    isDeleting: deleteCityMutation.isPending,
  }
}

// Hook for single city
export function useAdminCity(id: string) {
  return useQuery({
    queryKey: cityKeys.detail(id),
    queryFn: () => fetchCity(id),
    enabled: !!id,
  })
}
