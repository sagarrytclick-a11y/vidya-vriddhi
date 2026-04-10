'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { College, CollegeFormData } from '@/types/college'

// Query keys for consistent cache management
export const collegeKeys = {
  all: ['colleges'] as const,
  lists: () => [...collegeKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...collegeKeys.lists(), filters] as const,
  details: () => [...collegeKeys.all, 'detail'] as const,
  detail: (id: string) => [...collegeKeys.details(), id] as const,
}

  // API functions
const fetchColleges = async (search?: string): Promise<College[]> => {
  const url = search ? `/api/colleges?search=${encodeURIComponent(search)}` : '/api/colleges'
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch colleges')
  }

  const data = await response.json()

  // Transform data to match expected format - optimized for list view
  return data.map((college: any) => ({
    id: college.id,
    name: college.name,
    slug: college.slug,
    description: college.description,
    active: college.active,
    countryId: college.country?.id || '',
    cityId: college.city?.id || '',
    createdAt: college.createdAt,
    updatedAt: college.updatedAt,
    establishment_year: college.establishment_year,
    features: college.features || [],
    imageURL: college.imageURL,
    logoURL: college.logoURL,
    Countryranking: college.Countryranking,
    Internationalranking: college.Internationalranking,
    // Include relation counts for display
    categoriesCount: college._count?.categories || 0,
    coursesCount: college._count?.courses || 0,
    examsCount: college._count?.exams || 0,
    // Include basic relation data for display
    city: college.city,
    country: college.country,
    // Empty arrays for compatibility - will be fetched when needed
    categories: [],
    courses: [],
    exams: []
  }))
}

const fetchCollege = async (id: string): Promise<College> => {
  const response = await fetch(`/api/colleges/${id}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch college')
  }
  
  return response.json()
}

const createCollege = async (collegeData: CollegeFormData): Promise<College> => {
  const response = await fetch('/api/colleges', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(collegeData)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create college')
  }

  return response.json()
}

const updateCollege = async ({ id, data }: { id: string; data: CollegeFormData }): Promise<College> => {
  const response = await fetch(`/api/colleges/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update college')
  }

  return response.json()
}

const deleteCollege = async (id: string): Promise<void> => {
  const response = await fetch(`/api/colleges/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete college')
  }
}

// Main hook
export function useColleges(search?: string) {
  const queryClient = useQueryClient()

  // Fetch all colleges
  const {
    data: colleges = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: collegeKeys.list(search ? { search } : {}),
    queryFn: () => fetchColleges(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create college mutation
  const createCollegeMutation = useMutation({
    mutationFn: createCollege,
    onSuccess: () => {
      toast.success('College created successfully')
      queryClient.invalidateQueries({ queryKey: collegeKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create college')
    },
  })

  // Update college mutation
  const updateCollegeMutation = useMutation({
    mutationFn: updateCollege,
    onSuccess: () => {
      toast.success('College updated successfully')
      queryClient.invalidateQueries({ queryKey: collegeKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update college')
    },
  })

  // Delete college mutation
  const deleteCollegeMutation = useMutation({
    mutationFn: deleteCollege,
    onSuccess: () => {
      toast.success('College deleted successfully')
      queryClient.invalidateQueries({ queryKey: collegeKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete college')
    },
  })

  const createCollegeHandler = async (data: CollegeFormData) => {
    await createCollegeMutation.mutateAsync(data)
  }

  const updateCollegeHandler = async (id: string, data: CollegeFormData) => {
    await updateCollegeMutation.mutateAsync({ id, data })
  }

  const deleteCollegeHandler = async (id: string) => {
    await deleteCollegeMutation.mutateAsync(id)
  }

  return {
    colleges,
    isLoading,
    error: error?.message || null,
    createCollege: createCollegeHandler,
    updateCollege: updateCollegeHandler,
    deleteCollege: deleteCollegeHandler,
    isCreating: createCollegeMutation.isPending,
    isUpdating: updateCollegeMutation.isPending,
    isDeleting: deleteCollegeMutation.isPending,
    refetchColleges: refetch,
  }
}

// Hook for single college
export function useCollege(id: string) {
  return useQuery({
    queryKey: collegeKeys.detail(id),
    queryFn: () => fetchCollege(id),
    enabled: !!id,
  })
}
