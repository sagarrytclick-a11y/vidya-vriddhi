'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'sonner'
import dynamic from 'next/dynamic'
import { QUERY_CONFIG } from '@/lib/query-utils'

// Dynamically import ReactQueryDevtools to avoid SSR issues
const ReactQueryDevtools = dynamic(
  () => import('@tanstack/react-query-devtools').then(mod => ({
    default: mod.ReactQueryDevtools
  })),
  { ssr: false }
)

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: QUERY_CONFIG.CACHE_TIMES.MEDIUM,
            gcTime: QUERY_CONFIG.CACHE_TIMES.LONG,
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors
              if (error && typeof error === 'object' && 'status' in error) {
                const status = error.status as number
                if (status >= 400 && status < 500) {
                  return false
                }
              }
              // Retry up to 3 times for other errors
              return failureCount < QUERY_CONFIG.RETRY_CONFIG.DEFAULT
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            networkMode: 'online',
          },
          mutations: {
            retry: false, // Don't retry mutations by default
            networkMode: 'online',
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
