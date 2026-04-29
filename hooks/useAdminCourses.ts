import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export interface Course {
  id: string
  name: string
  slug: string
  description: string | null
  active: boolean
  createdAt: string
  updatedAt: string
  colleges: Array<{
    id: string
    name: string
  }>
}

export interface CourseFormData {
  name: string
  slug: string
  description?: string
  active?: boolean
}

// Query keys for consistent cache management
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
}

// API functions
const fetchCourses = async ({ queryKey }: any): Promise<{ courses: Course[], pagination: any }> => {
  const [, , page = 1, limit = 10] = queryKey
  const response = await fetch(`/api/courses?page=${page}&limit=${limit}`)
  if (!response.ok) {
    throw new Error('Failed to fetch courses')
  }
  return response.json()
}

const fetchCourse = async (id: string): Promise<Course> => {
  const response = await fetch(`/api/courses/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch course')
  }
  return response.json()
}

const createCourse = async (data: CourseFormData): Promise<Course> => {
  const response = await fetch('/api/courses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create course')
  }
  
  return response.json()
}

const updateCourse = async ({ id, data }: { id: string; data: Partial<CourseFormData> }): Promise<Course> => {
  const response = await fetch(`/api/courses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update course')
  }
  
  return response.json()
}

const deleteCourse = async (id: string): Promise<void> => {
  const response = await fetch(`/api/courses/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete course')
  }
}

// Main hook
export function useAdminCourses(page: number = 1, limit: number = 10) {
  const queryClient = useQueryClient()

  // Fetch all courses
  const {
    data: response = { courses: [], pagination: { page, limit, total: 0, totalPages: 0 } },
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [...courseKeys.lists(), page, limit],
    queryFn: fetchCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      toast.success('Course created successfully')
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create course')
    },
  })

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      toast.success('Course updated successfully')
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: courseKeys.details() })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update course')
    },
  })

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      toast.success('Course deleted successfully')
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: courseKeys.details() })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete course')
    },
  })

  const createCourseHandler = async (data: CourseFormData) => {
    await createCourseMutation.mutateAsync(data)
  }

  const updateCourseHandler = async (id: string, data: Partial<CourseFormData>) => {
    await updateCourseMutation.mutateAsync({ id, data })
  }

  const deleteCourseHandler = async (id: string) => {
    await deleteCourseMutation.mutateAsync(id)
  }

  return {
    courses: response.courses,
    pagination: response.pagination,
    isLoading,
    error: error?.message || null,
    createCourse: createCourseHandler,
    updateCourse: updateCourseHandler,
    deleteCourse: deleteCourseHandler,
    isCreating: createCourseMutation.isPending,
    isUpdating: updateCourseMutation.isPending,
    isDeleting: deleteCourseMutation.isPending,
    refetchCourses: refetch,
  }
}

// Hook for single course
export function useAdminCourse(id: string) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => fetchCourse(id),
    enabled: !!id,
  })
}
