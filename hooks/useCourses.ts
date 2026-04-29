import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

interface Course {
  id: string
  name: string
  slug: string
  description: string
  active: boolean
  createdAt: Date
  updatedAt: Date
  colleges: any[]
}

// Real API function - fetch courses from API endpoint
const fetchCourses = async ({ queryKey }: any): Promise<{ courses: Course[], pagination: any }> => {
  const [, category, page = 1, limit = 9] = queryKey
  try {
    const url = `/api/courses?page=${page}&limit=${limit}${category ? `&category=${category}` : ''}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Failed to fetch courses')
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching courses:', error)
    return { courses: [], pagination: { page, limit, total: 0, totalPages: 0 } }
  }
}

export function useCourses(category?: string, page: number = 1, limit: number = 9) {
  return useQuery({
    queryKey: ['courses', category, page, limit],
    queryFn: fetchCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  })
}

export function useCoursesByCategory(category?: string, page: number = 1, limit: number = 9) {
  const { data: response = { courses: [], pagination: { page, limit, total: 0, totalPages: 0 } }, isLoading } = useCourses(category, page, limit)
  
  const filteredCourses = useMemo(() => {
    if (!category || category === 'All') {
      return response.courses
    }
    
    return response.courses.filter((course: any) => 
      course.name.toLowerCase().includes(category.toLowerCase())
    )
  }, [response.courses, category])

  return {
    courses: filteredCourses || [],
    pagination: response.pagination,
    isLoading,
    error: null
  }
}
