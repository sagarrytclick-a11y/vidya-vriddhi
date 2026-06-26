import { useQuery } from '@tanstack/react-query'

interface College {
  id: string
  name: string
  slug: string
  description: string | null
  establishment_year: number | null
  Countryranking: number | null
  Internationalranking: number | null
  logoURL: string | null
  imageURL: string | null
  createdAt: string
  updatedAt: string
  city: {
    id: string
    name: string
    slug: string
  }
  country: {
    id: string
    name: string
    slug: string
    flagEmoji: string | null
  }
  courses: {
    id: string
    name: string
    slug: string
  }[]
  _count: {
    categories: number
    courses: number
    exams: number
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

const fetchIndianColleges = async (page: number = 1, limit: number = 10, search?: string, category?: string, course?: string, city?: string): Promise<PaginationResponse> => {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
  if (search) params.append('search', search)
  if (category) params.append('category', category)
  if (course) params.append('course', course)
  if (city) params.append('city', city)
  const response = await fetch(`/api/colleges/indian?${params.toString()}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch Indian colleges')
  }
  
  return response.json()
}

export const useIndianColleges = (page: number = 1, limit: number = 10, search?: string, category?: string, course?: string, city?: string) => {
  return useQuery({
    queryKey: ['colleges', 'indian', page, limit, search, category, course, city],
    queryFn: () => fetchIndianColleges(page, limit, search, category, course, city),
    staleTime: 5 * 60 * 1000,
  })
}
