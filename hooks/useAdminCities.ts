import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CityWithCountry, CreateCityData, UpdateCityData } from '@/types/domain'
import { apiClient, ApiClientError } from '@/lib/api-client'

// Re-export types for backward compatibility
export type { CityWithCountry as City, CreateCityData, UpdateCityData }

// Query keys for consistent cache management
export const cityKeys = {
  all: ['cities'] as const,
  lists: () => [...cityKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...cityKeys.lists(), filters] as const,
  details: () => [...cityKeys.all, 'detail'] as const,
  detail: (id: string) => [...cityKeys.details(), id] as const,
}

async function fetchCities({ queryKey }: any): Promise<{ data: CityWithCountry[], pagination: any }> {
  const [, , page = 1, limit = 10] = queryKey
  try {
    return await apiClient.get<{ data: CityWithCountry[], pagination: any }>(`/api/cities?page=${page}&limit=${limit}`)
  } catch (error) {
    console.error('Error fetching cities:', error)
    if (error instanceof ApiClientError) {
      throw new Error(error.message)
    }
    throw new Error('Failed to fetch cities')
  }
}

async function fetchCity(id: string): Promise<CityWithCountry> {
  try {
    return await apiClient.get<CityWithCountry>(`/api/cities/${id}`)
  } catch (error) {
    console.error('Error fetching city:', error)
    if (error instanceof ApiClientError) {
      throw new Error(error.message)
    }
    throw new Error('Failed to fetch city')
  }
}

async function createCity(data: CreateCityData): Promise<CityWithCountry> {
  try {
    return await apiClient.post<CityWithCountry>('/api/cities', data)
  } catch (error) {
    console.error('Error creating city:', error)
    if (error instanceof ApiClientError) {
      throw new Error(error.message)
    }
    throw new Error('Failed to create city')
  }
}

async function updateCity({ id, data }: { id: string; data: UpdateCityData }): Promise<CityWithCountry> {
  try {
    return await apiClient.put<CityWithCountry>(`/api/cities/${id}`, data)
  } catch (error) {
    console.error('Error updating city:', error)
    if (error instanceof ApiClientError) {
      throw new Error(error.message)
    }
    throw new Error('Failed to update city')
  }
}

async function deleteCity(id: string): Promise<void> {
  try {
    await apiClient.delete<void>(`/api/cities/${id}`)
  } catch (error) {
    console.error('Error deleting city:', error)
    if (error instanceof ApiClientError) {
      throw new Error(error.message)
    }
    throw new Error('Failed to delete city')
  }
}

export function useAdminCities(page: number = 1, limit: number = 10) {
  const queryClient = useQueryClient()
  const listKey = [...cityKeys.lists(), page, limit] as const

  const {
    data: response = { data: [], pagination: { page, limit, total: 0, totalPages: 0 } },
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: listKey,
    queryFn: fetchCities,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create city mutation
  const createCityMutation = useMutation({
    mutationFn: createCity,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: cityKeys.lists() })
      const previous = queryClient.getQueryData(listKey)
      const optimistic = {
        id: `temp-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      queryClient.setQueryData(listKey, (old: { data: CityWithCountry[]; pagination: any } | undefined) => {
        if (!old) return old
        return {
          ...old,
          data: [optimistic as CityWithCountry, ...old.data],
          pagination: { ...old.pagination, total: (old.pagination?.total || 0) + 1 },
        }
      })
      return { previous, tempId: optimistic.id }
    },
    onSuccess: (newCity, _vars, context) => {
      toast.success('City created successfully')
      queryClient.setQueryData(listKey, (old: { data: CityWithCountry[]; pagination: any } | undefined) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((city) => (city.id === context?.tempId ? newCity : city)),
        }
      })
    },
    onError: (error: Error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(listKey, context.previous)
      toast.error(error.message || 'Failed to create city')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cityKeys.lists(), refetchType: 'active' })
    },
  })

  // Update city mutation
  const updateCityMutation = useMutation({
    mutationFn: updateCity,
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: cityKeys.lists() })
      const previous = queryClient.getQueryData(listKey)
      queryClient.setQueryData(listKey, (old: { data: CityWithCountry[]; pagination: any } | undefined) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((city) => (city.id === id ? { ...city, ...data } : city)),
        }
      })
      return { previous }
    },
    onSuccess: (updatedCity) => {
      toast.success('City updated successfully')
      queryClient.setQueryData(listKey, (old: { data: CityWithCountry[]; pagination: any } | undefined) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((city) => (city.id === updatedCity.id ? updatedCity : city)),
        }
      })
    },
    onError: (error: Error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(listKey, context.previous)
      toast.error(error.message || 'Failed to update city')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cityKeys.lists(), refetchType: 'active' })
    },
  })

  // Delete city mutation
  const deleteCityMutation = useMutation({
    mutationFn: deleteCity,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: cityKeys.lists() })
      const previous = queryClient.getQueryData(listKey)
      queryClient.setQueryData(listKey, (old: { data: CityWithCountry[]; pagination: any } | undefined) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.filter((city) => city.id !== id),
          pagination: {
            ...old.pagination,
            total: Math.max(0, (old.pagination?.total || 1) - 1),
          },
        }
      })
      return { previous }
    },
    onSuccess: () => {
      toast.success('City deleted successfully')
    },
    onError: (error: Error, _id, context) => {
      if (context?.previous) queryClient.setQueryData(listKey, context.previous)
      toast.error(error.message || 'Failed to delete city')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cityKeys.lists(), refetchType: 'active' })
    },
  })

  return {
    cities: response.data,
    pagination: response.pagination,
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
