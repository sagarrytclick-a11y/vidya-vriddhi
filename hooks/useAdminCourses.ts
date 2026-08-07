import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CourseWithColleges, CourseFormData } from '@/types/domain'

// Re-export types for backward compatibility
export type { CourseWithColleges as Course, CourseFormData }

// Query keys for consistent cache management
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
}

// API functions
const fetchCourses = async ({ queryKey }: any): Promise<{ data: CourseWithColleges[], pagination: any }> => {
  const [, , page = 1, limit = 10] = queryKey
  const response = await fetch(`/api/courses?page=${page}&limit=${limit}`)
  if (!response.ok) {
    throw new Error('Failed to fetch courses')
  }
  return response.json()
}

const fetchCourse = async (id: string): Promise<CourseWithColleges> => {
  const response = await fetch(`/api/courses/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch course')
  }
  return response.json()
}

const createCourse = async (data: CourseFormData): Promise<CourseWithColleges> => {
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

const updateCourse = async ({ id, data }: { id: string; data: Partial<CourseFormData> }): Promise<CourseWithColleges> => {
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
    data: response = { data: [], pagination: { page, limit, total: 0, totalPages: 0 } },
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [...courseKeys.lists(), page, limit],
    queryFn: fetchCourses,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: (newCourse) => {
      toast.success('Course created successfully')
      queryClient.setQueryData([...courseKeys.lists(), page, limit], (old: { data: CourseWithColleges[], pagination: any } | undefined) => {
        if (!old) return old
        return { ...old, data: [newCourse, ...old.data], pagination: { ...old.pagination, total: old.pagination.total + 1 } }
      })
      queryClient.invalidateQueries({ queryKey: courseKeys.lists(), refetchType: 'active' })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create course')
    },
  })

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: updateCourse,
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: courseKeys.lists() })
      const previous = queryClient.getQueryData([...courseKeys.lists(), page, limit])
      queryClient.setQueryData([...courseKeys.lists(), page, limit], (old: { data: CourseWithColleges[], pagination: any } | undefined) => {
        if (!old) return old
        return { ...old, data: old.data.map((c) => c.id === id ? { ...c, ...data } : c) }
      })
      return { previous }
    },
    onSuccess: () => {
      toast.success('Course updated successfully')
    },
    onError: (error: Error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData([...courseKeys.lists(), page, limit], context.previous)
      toast.error(error.message || 'Failed to update course')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists(), refetchType: 'active' })
      queryClient.invalidateQueries({ queryKey: courseKeys.details(), refetchType: 'active' })
    },
  })

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: courseKeys.lists() })
      const previous = queryClient.getQueryData([...courseKeys.lists(), page, limit])
      queryClient.setQueryData([...courseKeys.lists(), page, limit], (old: { data: CourseWithColleges[], pagination: any } | undefined) => {
        if (!old) return old
        return { ...old, data: old.data.filter((c) => c.id !== id), pagination: { ...old.pagination, total: old.pagination.total - 1 } }
      })
      return { previous }
    },
    onSuccess: () => {
      toast.success('Course deleted successfully')
    },
    onError: (error: Error, _id, context) => {
      if (context?.previous) queryClient.setQueryData([...courseKeys.lists(), page, limit], context.previous)
      toast.error(error.message || 'Failed to delete course')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists(), refetchType: 'active' })
      queryClient.invalidateQueries({ queryKey: courseKeys.details(), refetchType: 'active' })
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
    courses: response.data,
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
