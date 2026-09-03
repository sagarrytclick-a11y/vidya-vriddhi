import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

interface SearchResult {
  id: string
  name: string
  type: 'College' | 'Exam' | 'News' | 'Course'
  image: string | null
  slug: string
  additionalInfo: string
  flag?: string | null
}

interface SearchResponse {
  results: SearchResult[]
}

const fetchSearch = async (query: string, limit: number = 10): Promise<SearchResult[]> => {
  if (!query.trim()) {
    return []
  }

  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=${limit}`)

  if (!response.ok) {
    throw new Error('Failed to search')
  }

  const data: SearchResponse = await response.json()
  return data.results
}

export const useSearch = (query: string, limit: number = 10) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  return useQuery({
    queryKey: ['search', debouncedQuery, limit],
    queryFn: () => fetchSearch(debouncedQuery, limit),
    enabled: debouncedQuery.trim().length >= 1,
    staleTime: 2 * 60 * 1000,
  })
}
