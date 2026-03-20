'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
  showText?: boolean
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
}

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
}

export function Loading({ 
  size = 'md', 
  text = 'Loading...', 
  className,
  showText = true 
}: LoadingProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-blue-500', sizeClasses[size])} />
      {showText && (
        <span className={cn('text-gray-400', textSizeClasses[size])}>
          {text}
        </span>
      )}
    </div>
  )
}

export function LoadingSpinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  return (
    <Loader2 className={cn('animate-spin text-blue-500', sizeClasses[size], className)} />
  )
}

export function LoadingPage({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loading size="lg" text={text} />
    </div>
  )
}

export function LoadingTable({ text = 'Loading data...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <Loading size="md" text={text} />
    </div>
  )
}

export function LoadingButton({ text = 'Loading...', size = 'sm' }: { text?: string, size?: 'sm' | 'md' | 'lg' }) {
  return (
    <Loading size={size} text={text} showText={true} />
  )
}
