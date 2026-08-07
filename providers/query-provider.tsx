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
        theme="dark"
        position="top-right"
        expand={false}
        closeButton
        toastOptions={{
          classNames: {
            toast:
              'group toast !rounded-xl !border-white/6 !bg-[#151a22] !text-white !shadow-[0_20px_50px_-12px_rgba(0,0,0,0.75)]',
            title: '!text-sm !font-medium !text-white',
            description: '!text-xs !text-[#9ca3af]',
            actionButton:
              '!rounded-lg !bg-[#ea580c] !text-white hover:!bg-[#c2410c]',
            cancelButton:
              '!rounded-lg !bg-[#1e2430] !text-[#d1d5db]',
            closeButton:
              '!border-white/6 !bg-[#1e2430] !text-[#9ca3af] hover:!bg-[#252b38] hover:!text-white',
            success:
              '!border-[#34d399]/25 !bg-[#12161e] [&>[data-icon]]:!text-[#34d399]',
            error:
              '!border-rose-500/30 !bg-[#12161e] [&>[data-icon]]:!text-rose-400',
            warning:
              '!border-[#fbbf24]/25 !bg-[#12161e] [&>[data-icon]]:!text-[#fbbf24]',
            info:
              '!border-[#ea580c]/30 !bg-[#12161e] [&>[data-icon]]:!text-[#ea580c]',
            loading:
              '!border-white/6 !bg-[#151a22] [&>[data-icon]]:!text-[#ea580c]',
          },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
