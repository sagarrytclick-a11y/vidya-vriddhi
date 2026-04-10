import { useQuery } from '@tanstack/react-query'

interface News {
  id: string
  title: string
  slug: string
  content: string
  imageUrl: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

const fetchNews = async (limit: number = 10): Promise<News[]> => {
  const response = await fetch(`/api/news?limit=${limit}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch news')
  }
  
  return response.json()
}

export const useNews = (limit: number = 10) => {
  return useQuery({
    queryKey: ['news', limit],
    queryFn: () => fetchNews(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
