import { useQuery } from '@tanstack/react-query'

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
  description: string
  active: boolean
  establishment_year: number | null
  Countryranking: number | null
  Internationalranking: number | null
  logoURL: string | null
  imageURL: string | null
  city: {
    id: string
    name: string
    slug: string
  }
  country: {
    id: string
    name: string
    slug: string
  }
  courses: {
    id: string
    name: string
    slug: string
  }[]
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
  const page = parseInt(searchParams.page || '1')
  
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['public-colleges', searchParams],
    queryFn: () => fetchColleges(searchParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
  
  return {
    colleges: data?.colleges || [],
    pagination: data?.pagination || {
      page,
      limit: 10,
      total: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    },
    isLoading,
    error: error?.message || null,
    refetch,
  }
}
