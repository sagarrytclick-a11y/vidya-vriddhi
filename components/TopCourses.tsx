'use client'

import React, { useState } from 'react'
import { Clock, DollarSign, Building, ChevronLeft, ChevronRight, ArrowRight, BookOpen, ExternalLink, MapPin } from 'lucide-react'
import { useCourses } from '@/hooks/useCourses'
import Link from 'next/link'

interface Course {
  id: string
  name: string
  slug: string
  description: string | null
  colleges?: any
}

interface CourseCardProps {
  course: Course
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="shrink-0 w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
      <div className="flex items-center space-x-2 text-[#94A3B8] mb-3">
      <MapPin className="w-6 h-6 text-orange-500" />
    </div>

        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">{course.name}</h3>
            {course.description && (
              <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Building className="w-4 h-4 text-gray-400" />
            <span>{course.colleges?.length || 0} Colleges</span>
          </div>
        </div>
        
      
      </div>
    </div>
  )
}

const TopCourses: React.FC = () => {
  // Fetch courses using custom hook
  const { data: response, isLoading, error } = useCourses()
  const courses = response?.courses || []

  const scrollLeft = () => {
    const element = document.getElementById('courses-scroll-container')
    if (element) {
      element.scrollBy({ left: -320, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    const element = document.getElementById('courses-scroll-container')
    if (element) {
      element.scrollBy({ left: 320, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Top Courses</h2>
          <Link href="/courses">
            <button className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium">
              <span>View all courses</span>
              <ExternalLink className="w-5 h-5" />
            </button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 text-center">
            <BookOpen className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Unable to load courses</p>
            <p className="text-gray-500 text-sm mt-1">Please try again later</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && courses && courses.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">No courses found</p>
            <p className="text-gray-500 text-sm mt-1">Courses will appear here once added to the database</p>
          </div>
        )}

        {/* Course Cards */}
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
