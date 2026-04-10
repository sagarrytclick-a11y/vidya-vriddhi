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
  return useQuery({
    queryKey: ['search', query, limit],
    queryFn: () => fetchSearch(query, limit),
    enabled: query.trim().length > 2, // Only search when query has at least 3 characters
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
