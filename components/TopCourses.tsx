'use client'

import React from 'react'
import { Building, ExternalLink, MapPin, BookOpen } from 'lucide-react'
import { useCourses } from '@/hooks/useCourses'
import { CourseWithColleges } from '@/types/domain'
import { SkeletonPulse } from '@/components/ui/skeletons'
import Link from 'next/link'

interface CourseCardProps {
  course: CourseWithColleges
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link
      href={`/colleges?course=${encodeURIComponent(course.slug)}`}
      className="shrink-0 w-64 sm:w-80 block group"
    >
      <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md hover:border-orange-200 transition-all">
        <div className="flex flex-col h-full">
          <div className="flex items-center space-x-2 text-[#94A3B8] mb-3">
            <MapPin className="w-6 h-6 text-orange-500" />
          </div>

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight group-hover:text-orange-600 transition-colors">
                {course.name}
              </h3>
              {course.description && (
                <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
              )}
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Building className="w-4 h-4 text-gray-400" />
              <span>{course._count?.colleges ?? course.colleges?.length ?? 0} Colleges</span>
            </div>
          </div>

          <span className="mt-auto text-sm font-medium text-orange-500 group-hover:text-orange-600 inline-flex items-center gap-1">
            View colleges
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

const TopCourses: React.FC = () => {
  const { data: response, isLoading, error } = useCourses()
  const courses = response?.data || []

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Top Courses</h2>
          <Link href="/courses">
            <button className="flex items-center space-x-1 sm:space-x-2 text-orange-500 hover:text-orange-600 font-medium text-xs sm:text-sm">
              <span>View all courses</span>
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </Link>
        </div>

        {isLoading && (
          <div className="relative">
            <div className="flex space-x-6 overflow-hidden pb-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="shrink-0 w-80 bg-white rounded-xl border border-gray-200 p-6">
                  <div className="space-y-4">
                    <SkeletonPulse className="h-6 w-3/4" />
                    <SkeletonPulse className="h-4 w-full" />
                    <SkeletonPulse className="h-4 w-2/3" />
                    <div className="flex items-center space-x-2 pt-2">
                      <SkeletonPulse className="h-4 w-4 rounded-full" />
                      <SkeletonPulse className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 text-center">
            <BookOpen className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Unable to load courses</p>
            <p className="text-gray-500 text-sm mt-1">Please try again later</p>
          </div>
        )}

        {!isLoading && !error && courses && courses.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">No courses found</p>
            <p className="text-gray-500 text-sm mt-1">Courses will appear here once added to the database</p>
          </div>
        )}

        {!isLoading && !error && courses && courses.length > 0 && (
          <div className="relative">
            <div
              id="courses-scroll-container"
              className="flex space-x-6 overflow-x-auto pb-4 scroll-smooth"
            >
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopCourses
