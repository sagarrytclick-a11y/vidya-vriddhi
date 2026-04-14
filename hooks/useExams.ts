import { useQuery } from '@tanstack/react-query'

interface Exam {
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

const fetchExams = async (limit: number = 10): Promise<Exam[]> => {
  const response = await fetch(`/api/exams?limit=${limit}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch exams')
  }
  
  return response.json()
}

export const useExams = (limit: number = 10) => {
  return useQuery({
    queryKey: ['exams', limit],
    queryFn: () => fetchExams(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
