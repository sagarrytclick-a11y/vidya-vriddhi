import { useQuery } from '@tanstack/react-query'

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  imageUrl: string | null
  active: boolean
  createdAt: string
  updatedAt: string
  author?: {
    name: string
  }
}

interface BlogsResponse {
  blogs: Blog[]
  total: number
  limit: number
  skip: number
}

const fetchBlogs = async (limit: number = 10): Promise<BlogsResponse> => {
  const response = await fetch(`/api/blogs?limit=${limit}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch blogs')
  }
  
  return response.json()
}

export const usePublicBlogs = (limit: number = 10) => {
  return useQuery({
    queryKey: ['public-blogs', limit],
    queryFn: () => fetchBlogs(limit),
    staleTime: 5 * 60 * 1000,
  })
}
