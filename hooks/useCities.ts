import { useQuery } from '@tanstack/react-query'

interface City {
  id: string
  name: string
  slug: string
  description: string | null
  cityImageURL: string | null
  features: string[]
  active: boolean
  createdAt: string
  updatedAt: string
  country: {
    id: string
    name: string
    slug: string
    flagEmoji: string | null
  }
  _count: {
    colleges: number
  }
}

const fetchCities = async (limit: number = 10): Promise<City[]> => {
  try {
    const response = await fetch(`/api/cities?limit=${limit}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch cities')
    }
    
    const cities = await response.json()
    return cities
  } catch (error) {
    console.error('Error fetching cities:', error)
    return []
  }
}

export const useCities = (limit: number = 10) => {
  return useQuery({
    queryKey: ['cities', limit],
    queryFn: () => fetchCities(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCitiesData = (limit: number = 10) => {
  const query = useCities(limit)
  return {
    cities: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
  }
}
