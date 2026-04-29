import { useQuery } from '@tanstack/react-query'
import { apiClient, ApiClientError } from '@/lib/api-client'

export interface Exam {
  id: string
  name: string
  slug: string
  shortName: string
  description: string
  conductingBody: string
  examMode: 'ONLINE' | 'OFFLINE' | 'HYBRID'
  examType: 'NATIONAL' | 'STATE' | 'UNIVERSITY' | 'INTERNATIONAL'
  frequency: 'ONCE_A_YEAR' | 'TWICE_A_YEAR' | 'QUARTERLY' | 'MONTHLY'
  active: boolean
  examImageurl: string | null
  examDates: any
  examPattern?: any
  overview?: any
  registration?: any
  resultStatistics?: any
  createdAt: string
  updatedAt: string
}

interface ExamsResponse {
  data: Exam[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

const fetchExams = async (limit: number = 10): Promise<Exam[]> => {
  try {
    const response = await apiClient.get<ExamsResponse>(`/api/exams?limit=${limit}`)
    return response.data
  } catch (error) {
    console.error('Error fetching exams:', error)
    if (error instanceof ApiClientError) {
      throw new Error(error.message)
    }
    throw new Error('Failed to fetch exams')
  }
}

export const useExams = (limit: number = 10) => {
  return useQuery({
    queryKey: ['exams', limit],
    queryFn: () => fetchExams(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
