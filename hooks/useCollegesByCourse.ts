import { useQuery } from '@tanstack/react-query'

interface College {
  id: string
  name: string
  slug: string
  description: string | null
  active: boolean
  establishment_year: number | null
  Countryranking: string | null
  Internationalranking: string | null
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

const fetchCollegesByCourse = async (courseName: string): Promise<College[]> => {
  const response = await fetch(`/api/colleges/by-course?course=${encodeURIComponent(courseName)}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch colleges')
  }
  
  return response.json()
}

export const useCollegesByCourse = (courseName: string) => {
  return useQuery({
    queryKey: ['colleges', 'by-course', courseName],
    queryFn: () => fetchCollegesByCourse(courseName),
    enabled: courseName !== 'All' && courseName.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
