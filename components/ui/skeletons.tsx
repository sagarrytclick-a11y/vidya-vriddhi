'use client'

import React from 'react'

/**
 * Base Skeleton Pulse Component
 */
export function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  )
}

/**
 * Card Skeleton - For course cards, news cards, etc.
 */
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-4">
          {/* Image placeholder */}
          <SkeletonPulse className="h-40 w-full rounded-lg" />
          {/* Title placeholder */}
          <SkeletonPulse className="h-6 w-3/4" />
          {/* Description placeholder */}
          <SkeletonPulse className="h-4 w-full" />
          <SkeletonPulse className="h-4 w-2/3" />
          {/* Footer placeholder */}
          <div className="flex justify-between items-center pt-2">
            <SkeletonPulse className="h-4 w-20" />
            <SkeletonPulse className="h-8 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Table Skeleton - For admin tables, data tables
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 p-4 border-b grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonPulse key={i} className="h-5 w-24" />
        ))}
      </div>
      {/* Rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 grid gap-4 items-center" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <SkeletonPulse key={colIndex} className={`h-4 ${colIndex === 0 ? 'w-32' : 'w-20'}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * List Skeleton - For news list, blog list
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border rounded-lg">
          {/* Thumbnail */}
          <SkeletonPulse className="h-20 w-20 rounded-lg shrink-0" />
          {/* Content */}
          <div className="flex-1 space-y-2">
            <SkeletonPulse className="h-5 w-3/4" />
            <SkeletonPulse className="h-4 w-full" />
            <SkeletonPulse className="h-4 w-1/2" />
            <div className="flex gap-2 pt-1">
              <SkeletonPulse className="h-3 w-16" />
              <SkeletonPulse className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Hero Skeleton - For hero sections with large image
 */
export function HeroSkeleton() {
  return (
    <div className="space-y-6">
      {/* Main hero area */}
      <SkeletonPulse className="h-64 w-full rounded-xl" />
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-2">
            <SkeletonPulse className="h-8 w-16" />
            <SkeletonPulse className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Detail Page Skeleton - For detail views
 */
export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <SkeletonPulse className="h-16 w-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <SkeletonPulse className="h-8 w-1/3" />
          <SkeletonPulse className="h-4 w-1/4" />
        </div>
      </div>
      {/* Content sections */}
      <SkeletonPulse className="h-40 w-full rounded-lg" />
      <div className="space-y-2">
        <SkeletonPulse className="h-4 w-full" />
        <SkeletonPulse className="h-4 w-full" />
        <SkeletonPulse className="h-4 w-2/3" />
      </div>
    </div>
  )
}

/**
 * Stats Cards Skeleton - For dashboard stats
 */
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border rounded-lg p-6 space-y-3">
          <div className="flex items-center justify-between">
            <SkeletonPulse className="h-10 w-10 rounded-full" />
            <SkeletonPulse className="h-6 w-16" />
          </div>
          <SkeletonPulse className="h-4 w-20" />
        </div>
      ))}
    </div>
  )
}

export default {
  Card: CardSkeleton,
  Table: TableSkeleton,
  List: ListSkeleton,
  Hero: HeroSkeleton,
  Detail: DetailSkeleton,
  Stats: StatsSkeleton,
  Pulse: SkeletonPulse,
}
