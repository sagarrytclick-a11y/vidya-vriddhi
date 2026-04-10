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

const fetchIndianColleges = async (page: number = 1, limit: number = 10): Promise<PaginationResponse> => {
  const response = await fetch(`/api/colleges/indian?page=${page}&limit=${limit}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch Indian colleges')
  }
  
  return response.json()
}

export const useIndianColleges = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['colleges', 'indian', page, limit],
    queryFn: () => fetchIndianColleges(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
