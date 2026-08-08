import { useQuery } from '@tanstack/react-query'
import { CityWithStats } from '@/types/domain'

type CitiesPagination = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

type UseCitiesOptions = {
  page?: number
  limit?: number
  search?: string
  active?: boolean
}

const fetchCities = async (
  page: number = 1,
  limit: number = 10,
  search: string = '',
  active?: boolean
): Promise<{ data: CityWithStats[]; pagination: CitiesPagination }> => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })
    if (search.trim()) params.set('search', search.trim())
    if (active) params.set('active', 'true')

    const response = await fetch(`/api/cities?${params.toString()}`)

    if (!response.ok) {
      throw new Error('Failed to fetch cities')
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching cities:', error)
    return {
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
    }
  }
}

/** Supports `useCities(100)` or `useCities({ page, limit, search, active })` */
export const useCities = (limitOrOptions: number | UseCitiesOptions = 10) => {
  const options: Required<Pick<UseCitiesOptions, 'page' | 'limit' | 'search'>> & { active?: boolean } =
    typeof limitOrOptions === 'number'
      ? { page: 1, limit: limitOrOptions, search: '' }
      : {
          page: limitOrOptions.page ?? 1,
          limit: limitOrOptions.limit ?? 12,
          search: limitOrOptions.search ?? '',
          active: limitOrOptions.active,
        }

  return useQuery({
    queryKey: ['cities', options.page, options.limit, options.search, options.active ?? null],
    queryFn: () => fetchCities(options.page, options.limit, options.search, options.active),
    staleTime: 5 * 60 * 1000,
  })
}

export const useCitiesData = (limit: number = 10) => {
  const query = useCities(limit)
  return {
    cities: query.data?.data || [],
    isLoading: query.isLoading,
    error: query.error,
  }
}
