import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { CourseWithColleges } from '@/types/domain'
import { apiClient, ApiClientError } from '@/lib/api-client'

// Real API function - fetch courses from API endpoint using apiClient
const fetchCourses = async ({ queryKey }: any): Promise<{ data: CourseWithColleges[], pagination: any }> => {
  const [, category, page = 1, limit = 9] = queryKey
  try {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    if (category) params.append('category', category)

    const url = `/api/courses?${params.toString()}`
    return await apiClient.get<{ data: CourseWithColleges[], pagination: any }>(url)
  } catch (error) {
    console.error('Error fetching courses:', error)
    if (error instanceof ApiClientError) {
      throw new Error(error.message)
    }
    return { data: [], pagination: { page, limit, total: 0, totalPages: 0 } }
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
  const { data: response = { data: [], pagination: { page, limit, total: 0, totalPages: 0 } }, isLoading } = useCourses(category, page, limit)

  const filteredCourses = useMemo(() => {
    if (!category || category === 'All') {
      return response.data
    }

    return response.data.filter((course) =>
      course.name.toLowerCase().includes(category.toLowerCase())
    )
  }, [response.data, category])

  return {
    courses: filteredCourses || [],
    pagination: response.pagination,
    isLoading,
    error: null
  }
}
