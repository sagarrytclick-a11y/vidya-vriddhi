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
const fetchCourses = async (category?: string): Promise<Course[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/courses${category ? `?category=${category}` : ''}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch courses')
    }
    
    const courses = await response.json()
    return courses
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

export function useCourses(category?: string) {
  return useQuery({
    queryKey: ['courses', category],
    queryFn: () => fetchCourses(category),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  })
}

export function useCoursesByCategory(category?: string) {
  const { data: courses = [] } = useCourses(category)
  
  const filteredCourses = useMemo(() => {
    if (!category || category === 'All') {
      return courses
    }
    
    return courses.filter((course: any) => 
      course.name.toLowerCase().includes(category.toLowerCase())
    )
  }, [courses, category])

  return {
    courses: filteredCourses || [],
    isLoading: !courses,
    error: null
  }
}
