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
  data: News[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

const fetchNews = async (limit: number = 10, skip: number = 0): Promise<NewsResponse> => {
  const page = Math.floor(skip / limit) + 1
  const response = await fetch(`/api/news?page=${page}&limit=${limit}`)

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
