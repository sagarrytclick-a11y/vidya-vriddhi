import { useQuery } from '@tanstack/react-query'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  active: boolean
  categoryImageUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryData {
  name: string
  slug: string
  description?: string
  categoryImageUrl?: string
  active?: boolean
}

export interface UpdateCategoryData extends CreateCategoryData {
  id: string
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface CategoriesResponse {
  data: Category[]
  pagination: PaginationInfo
}

const fetchCategories = async ({ queryKey }: { queryKey: readonly unknown[] }): Promise<CategoriesResponse> => {
  const [, filters] = queryKey as [string, { page: number; limit: number; search: string }]
  const { page = 1, limit = 10, search = '' } = filters

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search
  })
  const url = `/api/categories?${params}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`)
  }

  const data: CategoriesResponse = await response.json()
  return data
}

export function useAdminCategories(page: number = 1, limit: number = 10, search: string = '') {
  const queryKey = ['admin-categories', { page, limit, search }]

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
    retry: 3,
  })

  const categories = data?.data || []
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  }


  return {
    categories,
    pagination,
    isLoading,
    error: error ? error.message : null,
    refetch,
  }
}
