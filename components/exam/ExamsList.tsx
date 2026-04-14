'use client'

import { useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, ArrowRight, Calendar, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Exam {
  id: string
  name: string
  slug: string
  shortName: string
  description: string
  conductingBody: string
  examMode: string
  examType: string
  examImageurl: string | null
  examDates: any
}

interface ExamsListProps {
  exams: Exam[]
  onLoadMore?: () => void
  hasMore?: boolean
  isLoading?: boolean
}

export function ExamsList({ exams, onLoadMore, hasMore = false, isLoading = false }: ExamsListProps) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasMore && !isLoading && onLoadMore) {
        onLoadMore()
      }
    },
    [hasMore, isLoading, onLoadMore]
  )

  useEffect(() => {
    if (loadMoreRef.current) {
      observerRef.current = new IntersectionObserver(handleObserver, {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      })
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleObserver])

  if (exams.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No exams found</h3>
        <p className="text-gray-500">Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>

      {/* Load More Trigger */}
      {hasMore && (
        <div 
          ref={loadMoreRef}
          className="flex justify-center py-8"
        >
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
              <span>Loading more exams...</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && exams.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You&apos;ve seen all {exams.length} exams</p>
        </div>
      )}
    </div>
  )
}

function ExamCard({ exam }: { exam: Exam }) {
  const examDates = exam.examDates as any
  const upcomingDate = examDates?.importantDates?.[0]?.date || 'TBA'
  const eventName = examDates?.importantDates?.[0]?.event || 'Exam Date'

  return (
    <Link href={`/exams/${exam.slug}`} className="group">
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200">
        <CardContent className="p-0">
          {/* Header with Logo */}
          <div className="flex">
            {/* Logo Section */}
            <div className="w-24 shrink-0 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
              {exam.examImageurl ? (
                <Image
                  src={exam.examImageurl}
                  alt={exam.shortName}
                  width={80}
                  height={80}
                  className="w-full h-20 object-contain"
                />
              ) : (
                <FileText className="w-10 h-10 text-orange-500" />
              )}
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {exam.shortName}
                </h3>
                {exam.examMode === 'ONLINE' && (
                  <Badge className="bg-green-100 text-green-700 text-xs">Online</Badge>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mb-1">{exam.name}</p>
              
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                <Award className="w-3 h-3" />
                <span className="text-xs">{exam.conductingBody}</span>
              </div>

              {/* Date Info */}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span className="text-orange-600 font-medium">{upcomingDate}</span>
              </div>
              <p className="text-xs text-gray-500 ml-6">{eventName}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
            <span className="text-xs text-gray-500">{exam.examType.replace('_', ' ')}</span>
            <span className="text-sm font-medium text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
              View Details <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
