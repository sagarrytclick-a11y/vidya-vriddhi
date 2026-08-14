import { useQuery } from '@tanstack/react-query'

interface FilterData {
  categories: { id: string; name: string; slug: string }[]
  courses: { id: string; name: string; slug: string }[]
  cities: { id: string; name: string; slug: string }[]
  exams: { id: string; name: string; slug: string }[]
}

const fetchFiltersData = async (): Promise<FilterData> => {
  const res = await fetch('/api/filters')
  if (!res.ok) throw new Error('Failed to fetch filters')
  return res.json()
}

export function useCollegesFilters() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['colleges-filters'],
    queryFn: fetchFiltersData,
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  return {
    categories: data?.categories || [],
    courses: data?.courses || [],
    cities: data?.cities || [],
    exams: data?.exams || [],
    isLoading: isLoading && !data,
    error: error?.message || null,
  }
}
