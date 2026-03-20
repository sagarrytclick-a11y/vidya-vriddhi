'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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
const fetchExams = async (search?: string): Promise<Exam[]> => {
  const url = search ? `/api/exams?search=${encodeURIComponent(search)}` : '/api/exams'
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch exams')
  }

  const data = await response.json()

  // Transform data to match expected format
  return data.map((exam: any) => ({
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
    colleges: exam.colleges || []
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

// Main hook
export function useExams(search?: string) {
  const queryClient = useQueryClient()

  // Fetch all exams
  const {
    data: exams = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: examKeys.list(search ? { search } : {}),
    queryFn: () => fetchExams(search),
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
  }
}

// Hook for single exam
export function useExam(id: string) {
  return useQuery({
    queryKey: examKeys.detail(id),
    queryFn: () => fetchExam(id),
    enabled: !!id,
  })
}
