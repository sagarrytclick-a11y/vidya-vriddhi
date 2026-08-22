import { useQuery } from '@tanstack/react-query'
import { useAdminContext } from '@/contexts/admin-context'

interface ServiceLeadStats {
  total: number
  pending: number
  resolved: number
  followUp: number
}

async function fetchServiceLeadStats(): Promise<ServiceLeadStats> {
  const response = await fetch('/api/service-enquiry/stats')
  if (!response.ok) {
    throw new Error('Failed to fetch service lead statistics')
  }
  return response.json()
}

export function useServiceLeadStats() {
  const { canViewLeads, isLoading: sessionLoading } = useAdminContext()
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['service-lead-stats'],
    queryFn: fetchServiceLeadStats,
    staleTime: 30 * 1000,
    retry: 1,
    enabled: !sessionLoading && canViewLeads,
  })

  return {
    stats: stats || { total: 0, pending: 0, resolved: 0, followUp: 0 },
    isLoading: sessionLoading || isLoading,
    error,
    refetch,
  }
}
