'use client'

import React from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QueryStateWrapperProps {
  isLoading: boolean
  error: Error | string | null
  isEmpty: boolean
  children: React.ReactNode
  loadingComponent?: React.ReactNode
  emptyComponent?: React.ReactNode
  onRetry?: () => void
}

const DefaultLoadingComponent = () => (
  <div className="flex items-center justify-center min-h-50">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
)

const DefaultEmptyComponent = () => (
  <div className="flex flex-col items-center justify-center min-h-50 text-muted-foreground">
    <div className="text-6xl mb-4 opacity-20">📭</div>
    <p className="text-lg font-medium">No data found</p>
    <p className="text-sm">Try adjusting your filters or search criteria</p>
  </div>
)

export function QueryStateWrapper({
  isLoading,
  error,
  isEmpty,
  children,
  loadingComponent = <DefaultLoadingComponent />,
  emptyComponent = <DefaultEmptyComponent />,
  onRetry,
}: QueryStateWrapperProps) {
  // Error state
  if (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    return (
      <div className="m-4 p-4 border border-red-200 bg-red-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <h3 className="font-semibold text-red-800">Error</h3>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-red-700">{errorMessage || 'Something went wrong. Please try again.'}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="w-fit"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return <>{loadingComponent}</>
  }

  // Empty state
  if (isEmpty) {
    return <>{emptyComponent}</>
  }

  // Success state - render children
  return <>{children}</>
}

export default QueryStateWrapper
