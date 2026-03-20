import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export interface Country {
  id: string
  name: string
  slug: string
  flagEmoji: string | null
  description: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCountryData {
  name: string
  slug: string
  flagEmoji?: string
  description?: string
  active?: boolean
}

export interface UpdateCountryData extends CreateCountryData {
  id: string
}

// Query keys for consistent cache management
export const countryKeys = {
  all: ['countries'] as const,
  lists: () => [...countryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...countryKeys.lists(), filters] as const,
  details: () => [...countryKeys.all, 'detail'] as const,
  detail: (id: string) => [...countryKeys.details(), id] as const,
}

// API functions
const fetchCountries = async (): Promise<Country[]> => {
  const response = await fetch('/api/countries')
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch countries')
  }

  return data.countries
}

const createCountry = async (countryData: CreateCountryData): Promise<Country> => {
  const response = await fetch('/api/countries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(countryData),
  })

  const data = await response.json()

  if (!response.ok) {
    if (data.fieldErrors) {
      const errorMessage = Object.values(data.fieldErrors).join(', ')
      throw new Error(errorMessage)
    }
    throw new Error(data.error || 'Failed to create country')
  }

  return data.country
}

const updateCountry = async ({ id, ...countryData }: UpdateCountryData): Promise<Country> => {
  const response = await fetch(`/api/countries/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(countryData),
  })

  const data = await response.json()

  if (!response.ok) {
    if (data.fieldErrors) {
      const errorMessage = Object.values(data.fieldErrors).join(', ')
      throw new Error(errorMessage)
    }
    throw new Error(data.error || 'Failed to update country')
  }

  return data.country
}

const deleteCountry = async (id: string): Promise<void> => {
  const response = await fetch(`/api/countries/${id}`, {
    method: 'DELETE',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete country')
  }
}

// Export the API functions for use in server actions
export { createCountry, updateCountry, deleteCountry }

// Custom hook
export function useCountries() {
  const queryClient = useQueryClient()

  // Fetch countries query
  const {
    data: countries = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: countryKeys.lists(),
    queryFn: fetchCountries,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create country mutation
  const createCountryMutation = useMutation({
    mutationFn: createCountry,
    onSuccess: (newCountry) => {
      queryClient.setQueryData(countryKeys.lists(), (oldCountries: Country[] = []) => [
        newCountry,
        ...oldCountries,
      ])
      toast.success('Country created successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create country')
    },
  })

  // Update country mutation
  const updateCountryMutation = useMutation({
    mutationFn: updateCountry,
    onSuccess: (updatedCountry) => {
      queryClient.setQueryData(countryKeys.lists(), (oldCountries: Country[] = []) =>
        oldCountries.map((country) =>
          country.id === updatedCountry.id ? updatedCountry : country
        )
      )
      toast.success('Country updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update country')
    },
  })

  // Delete country mutation
  const deleteCountryMutation = useMutation({
    mutationFn: deleteCountry,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(countryKeys.lists(), (oldCountries: Country[] = []) =>
        oldCountries.filter((country) => country.id !== deletedId)
      )
      toast.success('Country deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete country')
    },
  })

  return {
    // Data
    countries,
    isLoading,
    error,

    // Actions
    refetch,

    // Mutations
    createCountry: createCountryMutation.mutateAsync,
    updateCountry: updateCountryMutation.mutateAsync,
    deleteCountry: deleteCountryMutation.mutateAsync,

    // Loading states
    isCreating: createCountryMutation.isPending,
    isUpdating: updateCountryMutation.isPending,
    isDeleting: deleteCountryMutation.isPending,
  }
}
