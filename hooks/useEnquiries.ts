import { useQuery } from '@tanstack/react-query'
import { useAdminContext } from '@/contexts/admin-context'

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
  const { canViewLeads, isLoading: sessionLoading } = useAdminContext()
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['enquiry-stats'],
    queryFn: fetchEnquiryStats,
    staleTime: 30 * 1000,
    retry: 1,
    enabled: !sessionLoading && canViewLeads,
  })

  return {
    stats: stats || {
      total: 0,
      pending: 0,
      resolved: 0,
      followUp: 0
    },
    isLoading: sessionLoading || isLoading,
    error,
    refetch,
  }
}
