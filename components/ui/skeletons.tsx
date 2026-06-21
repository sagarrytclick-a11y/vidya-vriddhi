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

/**
 * Compare Colleges Skeleton - For compare colleges page
 */
export function CompareCollegesSkeleton({ collegeCounts = 3, rowCount = 6 }: { collegeCounts?: number; rowCount?: number }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <SkeletonPulse className="h-8 w-64 mb-3" />
              <SkeletonPulse className="h-5 w-40" />
            </div>
            <div className="flex items-center gap-3">
              <SkeletonPulse className="h-10 w-32" />
              <SkeletonPulse className="h-10 w-24" />
            </div>
          </div>
        </div>

        {/* Comparison Table Skeleton */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            {/* Table Header */}
            <div className="border-b border-gray-200">
              <div className="flex">
                {/* Criteria Column Header */}
                <div className="p-6 font-bold text-gray-900 bg-gray-50/50 w-40 md:w-64 border-r border-gray-100">
                  <SkeletonPulse className="h-5 w-20" />
                </div>
                {/* College Column Headers */}
                {Array.from({ length: collegeCounts }).map((_, i) => (
                  <div key={i} className="p-6 font-bold text-gray-900 bg-gray-50/50 min-w-50 md:min-w-75 border-l border-gray-100 flex-1">
                    <div className="space-y-3">
                      <div className="flex justify-center mb-2">
                        <SkeletonPulse className="h-8 w-8 rounded" />
                      </div>
                      <SkeletonPulse className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-100">
              {Array.from({ length: rowCount }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {/* Criteria Label */}
                  <div className="p-6 bg-gray-50/30 w-40 md:w-64 border-r border-gray-100">
                    <SkeletonPulse className="h-5 w-32" />
                  </div>
                  {/* College Data Cells */}
                  {Array.from({ length: collegeCounts }).map((_, colIndex) => (
                    <div key={colIndex} className="p-6 border-l border-gray-100 flex-1">
                      <div className="space-y-3">
                        {rowIndex === 0 && (
                          <>
                            <div className="flex justify-center mb-3">
                              <SkeletonPulse className="h-16 w-16 rounded-lg" />
                            </div>
                            <SkeletonPulse className="h-4 w-full" />
                          </>
                        )}
                        {rowIndex === 1 && (
                          <>
                            <SkeletonPulse className="h-4 w-full" />
                            <SkeletonPulse className="h-4 w-5/6" />
                            <SkeletonPulse className="h-4 w-4/5" />
                          </>
                        )}
                        {rowIndex === 2 && (
                          <>
                            <SkeletonPulse className="h-6 w-32" />
                            <SkeletonPulse className="h-4 w-24" />
                            <SkeletonPulse className="h-3 w-20" />
                          </>
                        )}
                        {(rowIndex === 3 || rowIndex === 4 || rowIndex === 5) && (
                          <>
                            <SkeletonPulse className="h-4 w-full" />
                            <SkeletonPulse className="h-4 w-5/6" />
                            <SkeletonPulse className="h-4 w-4/5" />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              {/* CTA Button Row */}
              <div className="flex">
                <div className="p-6 bg-gray-50/30 w-40 md:w-64"></div>
                {Array.from({ length: collegeCounts }).map((_, i) => (
                  <div key={i} className="p-6 border-l border-gray-100 flex-1">
                    <SkeletonPulse className="h-12 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
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
  CompareColleges: CompareCollegesSkeleton,
  Pulse: SkeletonPulse,
}
