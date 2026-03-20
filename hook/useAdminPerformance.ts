'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'
import { queryInvalidation, queryPerformanceLogger } from '@/lib/query-utils'

export function useAdminPerformance() {
  const queryClient = useQueryClient()

  // Prefetch critical data on mount
  useEffect(() => {
    const prefetchData = async () => {
      try {
        await queryInvalidation.prefetchAdminData(queryClient)
      } catch (error) {
        console.warn('Failed to prefetch admin data:', error)
      }
    }

    // Delay prefetch to not block initial render
    const timeoutId = setTimeout(prefetchData, 100)
    return () => clearTimeout(timeoutId)
  }, [queryClient])

  // Optimized refresh function with debouncing
  const debouncedRefresh = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout
      return (delay = 500) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          queryInvalidation.invalidateAdmin(queryClient)
        }, delay)
      }
    })(),
    [queryClient]
  )

  // Smart refresh based on user activity
  const smartRefresh = useCallback(() => {
    // Only refresh if data is stale
    const queries = queryClient.getQueryCache().getAll()
    const staleQueries = queries.filter(query => 
      query.state.dataUpdatedAt && 
      (Date.now() - query.state.dataUpdatedAt) > 5 * 60 * 1000 // 5 minutes
    )
    
    if (staleQueries.length > 0) {
      queryInvalidation.invalidateAdmin(queryClient)
      queryPerformanceLogger.logQueryPerformance(
        ['smart-refresh'], 
        Date.now()
      )
    }
  }, [queryClient])

  // Background sync for real-time updates
  const enableBackgroundSync = useCallback(() => {
    const interval = setInterval(() => {
      smartRefresh()
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [smartRefresh])

  // Cache warming for frequently accessed data
  const warmCache = useCallback(async () => {
    const criticalQueries = [
      ['colleges', 'list'],
      ['countries', 'list'],
      ['cities', 'list'],
    ]

    await Promise.allSettled(
      criticalQueries.map(queryKey =>
        queryClient.prefetchQuery({
          queryKey,
          staleTime: 2 * 60 * 1000, // 2 minutes
        })
      )
    )
  }, [queryClient])

  // Memory management
  const clearOldCache = useCallback(() => {
    const cache = queryClient.getQueryCache()
    const now = Date.now()
    
    cache.getAll().forEach(query => {
      const lastUpdated = query.state.dataUpdatedAt || 0
      const age = now - lastUpdated
      
      // Remove queries older than 30 minutes that aren't currently fetching
      if (age > 30 * 60 * 1000 && query.state.fetchStatus !== 'fetching') {
        queryClient.removeQueries({ queryKey: query.queryKey })
      }
    })
  }, [queryClient])

  // Performance monitoring
  const getCacheStats = useCallback(() => {
    const cache = queryClient.getQueryCache()
    const queries = cache.getAll()
    
    const stats = {
      totalQueries: queries.length,
      fetchingQueries: queries.filter(q => q.state.fetchStatus === 'fetching').length,
      staleQueries: queries.filter(q => 
        q.state.dataUpdatedAt && 
        (Date.now() - q.state.dataUpdatedAt) > 5 * 60 * 1000
      ).length,
      errorQueries: queries.filter(q => q.state.status === 'error').length,
      cacheSize: JSON.stringify(queries.map(q => q.state.data)).length,
    }

    queryPerformanceLogger.logCacheHitRate(
      stats.totalQueries - stats.fetchingQueries,
      stats.totalQueries
    )

    return stats
  }, [queryClient])

  return {
    debouncedRefresh,
    smartRefresh,
    enableBackgroundSync,
    warmCache,
    clearOldCache,
    getCacheStats,
    queryClient,
  }
}

// Hook for optimizing specific admin sections
export function useAdminSectionOptimization(section: string) {
  const queryClient = useQueryClient()

  // Section-specific cache warming
  const warmSectionCache = useCallback(async () => {
    const sectionQueries: Record<string, string[][]> = {
      colleges: [['colleges', 'list']],
      countries: [['countries', 'list']],
      cities: [['cities', 'list']],
      categories: [['categories', 'list']],
      courses: [['courses', 'list']],
      exams: [['exams', 'list']],
      blogs: [['blogs', 'list']],
      news: [['news', 'list']],
    }

    const queries = sectionQueries[section] || []
    await Promise.allSettled(
      queries.map(queryKey =>
        queryClient.prefetchQuery({
          queryKey,
          staleTime: 3 * 60 * 1000, // 3 minutes
        })
      )
    )
  }, [queryClient, section])

  // Section-specific invalidation
  const invalidateSection = useCallback(() => {
    const invalidators: Record<string, (qc: any) => void> = {
      colleges: queryInvalidation.invalidateColleges,
      countries: queryInvalidation.invalidateCountries,
      cities: queryInvalidation.invalidateCities,
      categories: queryInvalidation.invalidateCategories,
      courses: queryInvalidation.invalidateCourses,
      exams: queryInvalidation.invalidateExams,
      blogs: queryInvalidation.invalidateBlogs,
      news: queryInvalidation.invalidateNews,
    }

    const invalidate = invalidators[section]
    if (invalidate) {
      invalidate(queryClient)
    }
  }, [queryClient, section])

  return {
    warmSectionCache,
    invalidateSection,
  }
}
