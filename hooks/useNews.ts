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

interface NewsResponse {
  news: News[]
  total: number
  limit: number
  skip: number
}

const fetchNews = async (limit: number = 10, skip: number = 0): Promise<NewsResponse> => {
  const response = await fetch(`/api/news?limit=${limit}&skip=${skip}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch news')
  }
  
  return response.json()
}

export const useNews = (limit: number = 10, skip: number = 0) => {
  return useQuery({
    queryKey: ['news', limit, skip],
    queryFn: () => fetchNews(limit, skip),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
