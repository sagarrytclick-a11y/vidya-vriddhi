import { QueryClient } from '@tanstack/react-query'
import { collegeKeys } from '@/hook/useColleges'
import { countryKeys } from '@/hook/useCountries'
import { cityKeys } from '@/hook/useCities'
import { categoryKeys } from '@/hook/useCategories'
import { courseKeys } from '@/hook/useCourses'
import { examKeys } from '@/hook/useExams'
import { blogKeys } from '@/hook/useBlogs'
import { newsKeys } from '@/hook/useNews'

// Centralized query invalidation utilities
export const queryInvalidation = {
  // Invalidate all admin-related queries
  invalidateAdmin: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: collegeKeys.all })
    queryClient.invalidateQueries({ queryKey: countryKeys.all })
    queryClient.invalidateQueries({ queryKey: cityKeys.all })
    queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    queryClient.invalidateQueries({ queryKey: courseKeys.all })
    queryClient.invalidateQueries({ queryKey: examKeys.all })
    queryClient.invalidateQueries({ queryKey: blogKeys.all })
    queryClient.invalidateQueries({ queryKey: newsKeys.all })
  },

  // Invalidate specific entity types
  invalidateColleges: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: collegeKeys.all })
  },
  
  invalidateCountries: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: countryKeys.all })
  },
  
  invalidateCities: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: cityKeys.all })
  },
  
  invalidateCategories: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: categoryKeys.all })
  },
  
  invalidateCourses: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: courseKeys.all })
  },
  
  invalidateExams: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: examKeys.all })
  },
  
  invalidateBlogs: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: blogKeys.all })
  },
  
  invalidateNews: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: newsKeys.all })
  },

  // Optimistic updates
  updateCollegeInCache: (queryClient: QueryClient, updatedCollege: any) => {
    queryClient.setQueryData(collegeKeys.lists(), (oldColleges: any[] = []) =>
      oldColleges.map((college) =>
        college.id === updatedCollege.id ? updatedCollege : college
      )
    )
    queryClient.setQueryData(collegeKeys.detail(updatedCollege.id), updatedCollege)
  },

  addCollegeToCache: (queryClient: QueryClient, newCollege: any) => {
    queryClient.setQueryData(collegeKeys.lists(), (oldColleges: any[] = []) => [
      newCollege,
      ...oldColleges,
    ])
  },

  removeCollegeFromCache: (queryClient: QueryClient, collegeId: string) => {
    queryClient.setQueryData(collegeKeys.lists(), (oldColleges: any[] = []) =>
      oldColleges.filter((college) => college.id !== collegeId)
    )
    queryClient.removeQueries({ queryKey: collegeKeys.detail(collegeId) })
  },

  // Prefetch commonly accessed data
  prefetchAdminData: async (queryClient: QueryClient) => {
    // Prefetch all list queries for faster initial load
    await Promise.allSettled([
      queryClient.prefetchQuery({
        queryKey: collegeKeys.lists(),
        queryFn: async () => {
          const response = await fetch('/api/colleges')
          if (!response.ok) throw new Error('Failed to fetch colleges')
          return response.json()
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      }),
      queryClient.prefetchQuery({
        queryKey: countryKeys.lists(),
        queryFn: async () => {
          const response = await fetch('/api/countries')
          if (!response.ok) throw new Error('Failed to fetch countries')
          const data = await response.json()
          return data.countries
        },
        staleTime: 10 * 60 * 1000, // 10 minutes (countries change less frequently)
      }),
      queryClient.prefetchQuery({
        queryKey: cityKeys.lists(),
        queryFn: async () => {
          const response = await fetch('/api/cities')
          if (!response.ok) throw new Error('Failed to fetch cities')
          return response.json()
        },
        staleTime: 5 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: categoryKeys.lists(),
        queryFn: async () => {
          const response = await fetch('/api/categories')
          if (!response.ok) throw new Error('Failed to fetch categories')
          return response.json()
        },
        staleTime: 10 * 60 * 1000,
      }),
    ])
  },
}

// Query configuration constants
export const QUERY_CONFIG = {
  // Cache timing strategies
  CACHE_TIMES: {
    SHORT: 2 * 60 * 1000, // 2 minutes - frequently changing data
    MEDIUM: 5 * 60 * 1000, // 5 minutes - moderate change frequency
    LONG: 10 * 60 * 1000, // 10 minutes - rarely changing data
    VERY_LONG: 30 * 60 * 1000, // 30 minutes - static data
  },
  
  // Retry configuration
  RETRY_CONFIG: {
    DEFAULT: 3,
    NETWORK_ERROR: 2,
    SERVER_ERROR: 1,
  },

  // Stale times for different entity types
  STALE_TIMES: {
    colleges: 5 * 60 * 1000, // 5 minutes
    countries: 10 * 60 * 1000, // 10 minutes
    cities: 5 * 60 * 1000, // 5 minutes
    categories: 10 * 60 * 1000, // 10 minutes
    courses: 5 * 60 * 1000, // 5 minutes
    exams: 5 * 60 * 1000, // 5 minutes
    blogs: 3 * 60 * 1000, // 3 minutes
    news: 2 * 60 * 1000, // 2 minutes
  },
} as const

// Error handling utilities
export const handleQueryError = (error: Error, context: string) => {
  console.error(`Query error in ${context}:`, error)
  
  // You can integrate with error reporting services here
  if (error.message.includes('401')) {
    // Handle unauthorized errors
    console.warn('Unauthorized access - please log in again')
  } else if (error.message.includes('403')) {
    // Handle forbidden errors
    console.warn('Access forbidden - insufficient permissions')
  } else if (error.message.includes('500')) {
    // Handle server errors
    console.error('Server error - please try again later')
  }
}

// Performance monitoring
export const queryPerformanceLogger = {
  logQueryPerformance: (queryKey: string[], duration: number) => {
    if (duration > 5000) { // Log queries taking more than 5 seconds
      console.warn(`Slow query detected: ${queryKey.join('.')} took ${duration}ms`)
    }
  },
  
  logCacheHitRate: (hits: number, total: number) => {
    const hitRate = (hits / total) * 100
    console.log(`Query cache hit rate: ${hitRate.toFixed(2)}% (${hits}/${total})`)
  },
}
