import { useQuery } from '@tanstack/react-query'

interface Course {
  id: string
  name: string
  slug: string
  description: string | null
  active: boolean
  createdAt: string
  updatedAt: string
  colleges: {
    id: string
    name: string
  }[]
  _count: {
    colleges: number
  }
}

const fetchCourses = async (limit: number = 20): Promise<Course[]> => {
  const response = await fetch(`/api/courses?limit=${limit}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch courses')
  }
  
  return response.json()
}

export const useCourses = (limit: number = 20) => {
  return useQuery({
    queryKey: ['courses', limit],
    queryFn: () => fetchCourses(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
