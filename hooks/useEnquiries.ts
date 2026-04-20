import { useQuery } from '@tanstack/react-query'

interface EnquiryStats {
  total: number
  pending: number
  resolved: number
  followUp: number
}

const fetchEnquiryStats = async (): Promise<EnquiryStats> => {
  const response = await fetch('/api/enquiries/stats')
  
  if (!response.ok) {
    throw new Error('Failed to fetch enquiry statistics')
  }
  
  return response.json()
}

export function useEnquiryStats() {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['enquiry-stats'],
    queryFn: fetchEnquiryStats,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnMount: 'always',
    retry: 3,
  })

  return {
    stats: stats || {
      total: 0,
      pending: 0,
      resolved: 0,
      followUp: 0
    },
    isLoading,
    error,
    refetch,
  }
}
