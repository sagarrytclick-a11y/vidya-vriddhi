'use client'

import React from 'react'
import Link from 'next/link'
import { Calendar, Clock, ExternalLink, FileText } from 'lucide-react'
import { useExams } from '@/hooks/useExams'
import { SkeletonPulse } from '@/components/ui/skeletons'

interface Exam {
  id: string
  name: string
  shortName: string
  description: string
  examMode: 'ONLINE' | 'OFFLINE' | 'HYBRID'
  examDates: any
  examImageurl: string | null
  slug: string
}

interface ExamCardProps {
  exam: Exam
}

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  const isOnline = exam.examMode === 'ONLINE' || exam.examMode === 'HYBRID'
  
  // Extract date from examDates JSON if available
  const examDate = exam.examDates?.importantDates?.[0]?.date || 'TBA'
  
  return (
    <div className="shrink-0 w-72 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="flex h-full">
        {/* Logo - Left side taking full height */}
        <div className="w-20 h-full bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center flex-shrink-0">
          {exam.examImageurl ? (
            <img
              src={exam.examImageurl}
              alt={exam.shortName}
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <FileText className="w-8 h-8 text-orange-500" />
          )}
        </div>
        
        {/* Content - Right side */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">{exam.name}</h3>
            <p className="text-xs text-gray-500 mb-2">Exam Date</p>
            <p className="text-sm font-semibold text-orange-600 mb-2">{examDate}</p>
            
            {isOnline && (
              <span className="inline-block px-2 py-0.5 border border-orange-300 text-orange-600 text-[10px] font-semibold rounded">
                Online
              </span>
            )}
          </div>
          
          <Link href={`/exams/${exam.slug}`} className="mt-3 block w-full">
            <button className="w-full py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-colors">
              Exam Info &gt;
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const UpcomingExams: React.FC = () => {
  // Fetch exams using custom hook with limit of 10
  const { data: exams, isLoading, error } = useExams(10)

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Upcoming Exams</h2>
          <Link href="/exams" className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium">
            <span>View all exams</span>
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex space-x-6 overflow-hidden pb-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="shrink-0 w-72 bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex h-full">
                  <SkeletonPulse className="w-20 h-32" />
                  <div className="flex-1 p-4 space-y-3">
                    <SkeletonPulse className="h-5 w-3/4" />
                    <SkeletonPulse className="h-4 w-1/3" />
                    <SkeletonPulse className="h-4 w-1/2" />
                    <SkeletonPulse className="h-9 w-full rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 text-center">
            <FileText className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Unable to load exams</p>
            <p className="text-gray-500 text-sm mt-1">Please try again later</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && exams && exams.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">No exams found</p>
            <p className="text-gray-500 text-sm mt-1">Exams will appear here once added to the database</p>
          </div>
        )}

        {/* Exam Cards Horizontal Scroll */}
        {!isLoading && !error && exams && exams.length > 0 && (
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UpcomingExams
