'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Pagination } from '@/types/api'

interface Exam {
  id: string
  name: string
  shortName: string
  slug: string
  description?: string
  type: string
  mode: string
  frequency: string
  status: string
  conductingBody: string
  createdAt: string
  updatedAt: string
  active: boolean
  examImageurl?: string
  heroSection?: any
  overview?: any
  registration?: any
  examPattern?: any
  examDates?: any
  resultStatistics?: any
  colleges?: any[]
}

export interface ExamFormData {
  name: string
  shortName: string
  slug: string
  description?: string
  examType: string
  examMode: string
  frequency: string
  conductingBody: string
  active?: boolean
  examImageurl?: string
  heroSection?: any
  overview?: any
  registration?: any
  examPattern?: any
  examDates?: any
  resultStatistics?: any
}

// Query keys for consistent cache management
export const examKeys = {
  all: ['exams'] as const,
  lists: () => [...examKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...examKeys.lists(), filters] as const,
  details: () => [...examKeys.all, 'detail'] as const,
  detail: (id: string) => [...examKeys.details(), id] as const,
}

// API functions
interface PaginatedExamsResponse {
  data: Exam[]
  pagination: Pagination
}

const fetchExamsWithPagination = async (
  search?: string,
  page?: number,
  limit?: number
): Promise<PaginatedExamsResponse> => {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (page) params.append('page', page.toString())
  if (limit) params.append('limit', limit.toString())

  const url = `/api/exams?${params.toString()}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch exams')
  }

  const result = await response.json()

  // API returns paginated response: { data: [...], pagination: {...} }
  const exams = result.data || []
  const pagination = result.pagination || {
    page: 1,
    limit: 10,
    total: exams.length,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  }

  // Transform data to match expected format - preserve original field names for edit modal
  const transformedExams = exams.map((exam: any) => ({
    id: exam.id,
    name: exam.name,
    shortName: exam.shortName,
    slug: exam.slug,
    description: exam.description,
    type: exam.examType.charAt(0) + exam.examType.slice(1).toLowerCase(),
    mode: exam.examMode.charAt(0) + exam.examMode.slice(1).toLowerCase(),
    frequency: exam.frequency,
    status: exam.active ? 'Active' : 'Inactive',
    conductingBody: exam.conductingBody,
    createdAt: new Date(exam.createdAt).toLocaleDateString(),
    updatedAt: new Date(exam.updatedAt).toLocaleDateString(),
    active: exam.active,
    examImageurl: exam.examImageurl,
    heroSection: exam.heroSection,
    overview: exam.overview,
    registration: exam.registration,
    examPattern: exam.examPattern,
    examDates: exam.examDates,
    resultStatistics: exam.resultStatistics,
    colleges: exam.colleges || [],
    // Preserve original field names for edit modal
    examType: exam.examType,
    examMode: exam.examMode
  }))

  return { data: transformedExams, pagination }
}

const fetchExams = async (search?: string): Promise<Exam[]> => {
  const url = search ? `/api/exams?search=${encodeURIComponent(search)}` : '/api/exams'
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch exams')
  }

  const result = await response.json()

  // API returns paginated response: { data: [...], pagination: {...} }
  const exams = result.data || result

  // Transform data to match expected format - preserve original field names for edit modal
  return exams.map((exam: any) => ({
    id: exam.id,
    name: exam.name,
    shortName: exam.shortName,
    slug: exam.slug,
    description: exam.description,
    type: exam.examType.charAt(0) + exam.examType.slice(1).toLowerCase(),
    mode: exam.examMode.charAt(0) + exam.examMode.slice(1).toLowerCase(),
    frequency: exam.frequency,
    status: exam.active ? 'Active' : 'Inactive',
    conductingBody: exam.conductingBody,
    createdAt: new Date(exam.createdAt).toLocaleDateString(),
    updatedAt: new Date(exam.updatedAt).toLocaleDateString(),
    active: exam.active,
    examImageurl: exam.examImageurl,
    heroSection: exam.heroSection,
    overview: exam.overview,
    registration: exam.registration,
    examPattern: exam.examPattern,
    examDates: exam.examDates,
    resultStatistics: exam.resultStatistics,
    colleges: exam.colleges || [],
    // Preserve original field names for edit modal
    examType: exam.examType,
    examMode: exam.examMode
  }))
}

const fetchExam = async (id: string): Promise<Exam> => {
  const response = await fetch(`/api/exams/${id}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch exam')
  }
  
  return response.json()
}

const createExam = async (examData: ExamFormData): Promise<Exam> => {
  const response = await fetch('/api/exams', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(examData)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create exam')
  }

  return response.json()
}

const updateExam = async ({ id, data }: { id: string; data: Partial<ExamFormData> }): Promise<Exam> => {
  const response = await fetch(`/api/exams/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update exam')
  }

  return response.json()
}

const deleteExam = async (id: string): Promise<void> => {
  const response = await fetch(`/api/exams/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete exam')
  }
}

interface UseAdminExamsReturn {
  exams: Exam[]
  isLoading: boolean
  error: string | null
  createExam: (data: ExamFormData) => Promise<void>
  updateExam: (id: string, data: Partial<ExamFormData>) => Promise<void>
  deleteExam: (id: string) => Promise<void>
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  refetchExams: () => Promise<any>
  // Pagination
  pagination: Pagination | null
  page: number
  setPage: (page: number) => void
  limit: number
  setLimit: (limit: number) => void
}

// Main hook
export function useAdminExams(search?: string): UseAdminExamsReturn {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Fetch all exams with pagination
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: examKeys.list({ search: search || '', page, limit }),
    queryFn: () => fetchExamsWithPagination(search, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create exam mutation
  const createExamMutation = useMutation({
    mutationFn: createExam,
    onSuccess: () => {
      toast.success('Exam created successfully')
      queryClient.invalidateQueries({ queryKey: examKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create exam')
    },
  })

  // Update exam mutation
  const updateExamMutation = useMutation({
    mutationFn: updateExam,
    onSuccess: () => {
      toast.success('Exam updated successfully')
      queryClient.invalidateQueries({ queryKey: examKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update exam')
    },
  })

  // Delete exam mutation
  const deleteExamMutation = useMutation({
    mutationFn: deleteExam,
    onSuccess: () => {
      toast.success('Exam deleted successfully')
      queryClient.invalidateQueries({ queryKey: examKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete exam')
    },
  })

  const createExamHandler = async (data: ExamFormData) => {
    await createExamMutation.mutateAsync(data)
  }

  const updateExamHandler = async (id: string, data: Partial<ExamFormData>) => {
    await updateExamMutation.mutateAsync({ id, data })
  }

  const deleteExamHandler = async (id: string) => {
    await deleteExamMutation.mutateAsync(id)
  }

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1)
  }, [search])

  const exams = response?.data || []
  const pagination = response?.pagination || null

  return {
    exams,
    isLoading,
    error: error?.message || null,
    createExam: createExamHandler,
    updateExam: updateExamHandler,
    deleteExam: deleteExamHandler,
    isCreating: createExamMutation.isPending,
    isUpdating: updateExamMutation.isPending,
    isDeleting: deleteExamMutation.isPending,
    refetchExams: refetch,
    pagination,
    page,
    setPage,
    limit,
    setLimit,
  }
}

// Hook for single exam
export function useAdminExam(id: string) {
  return useQuery({
    queryKey: examKeys.detail(id),
    queryFn: () => fetchExam(id),
    enabled: !!id,
  })
}
