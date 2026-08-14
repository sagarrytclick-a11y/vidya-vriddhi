import { keepPreviousData, useQuery } from '@tanstack/react-query'

interface SearchParams {
  category?: string
  course?: string
  city?: string
  exam?: string
  search?: string
  page?: string
}

interface College {
  id: string
  name: string
  slug: string
  establishment_year: number | null
  Countryranking: string | null
  logoURL: string | null
  city: {
    id: string
    name: string
    slug: string
  } | null
  categories: {
    id: string
    name: string
    slug: string
  }[]
  _count: {
    courses: number
  }
}

interface PaginationResponse {
  colleges: College[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

const fetchColleges = async (searchParams: SearchParams): Promise<PaginationResponse> => {
  const params = new URLSearchParams()

  if (searchParams.category) params.set('category', searchParams.category)
  if (searchParams.course) params.set('course', searchParams.course)
  if (searchParams.city) params.set('city', searchParams.city)
  if (searchParams.exam) params.set('exam', searchParams.exam)
  if (searchParams.search) params.set('search', searchParams.search)
  if (searchParams.page) params.set('page', searchParams.page)

  const response = await fetch(`/api/colleges/indian?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Failed to fetch colleges')
  }

  return response.json()
}

export function usePublicColleges(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || '1', 10) || 1
  const paramsKey = {
    category: searchParams.category || '',
    course: searchParams.course || '',
    city: searchParams.city || '',
    exam: searchParams.exam || '',
    search: searchParams.search || '',
    page: searchParams.page || '1',
  }

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['public-colleges', paramsKey],
    queryFn: () => fetchColleges(searchParams),
    placeholderData: keepPreviousData,
    staleTime: searchParams.search ? 60 * 1000 : 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  return {
    colleges: data?.colleges || [],
    pagination: data?.pagination || {
      page,
      limit: 12,
      total: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
    /** True only on first load with no cached/previous data */
    isLoading: isLoading && !data,
    /** True while a request is in flight (including background refetch) */
    isFetching,
    error: isError ? error?.message || 'Failed to fetch colleges' : null,
    refetch,
  }
}
