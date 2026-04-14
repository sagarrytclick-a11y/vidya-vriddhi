
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, BookOpen, Clock, Users, Star, TrendingUp, Award, Calendar, MapPin, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { AdmissionButton } from '@/components/ui/AdmissionButton'
import { useCoursesByCategory } from '@/hooks/useCourses'


export default function CoursesPage() {
  const { courses: featuredCourses, isLoading, error } = useCoursesByCategory()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredCourses = featuredCourses.filter((course: any) => {
    const matchesSearch = searchTerm === '' || 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Error Loading Courses</h2>
          <p className="text-slate-600">Failed to load courses. Please try again.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-white">
        {/* Loading Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Loading <span className="text-orange-100">Courses</span> 2026
            </h1>
            <p className="text-xl text-orange-100/90 max-w-3xl mx-auto leading-relaxed">
              Fetching available courses...
            </p>
          </div>

          {/* Loading Skeleton Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-xl animate-pulse" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3"></div>
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore <span className="text-orange-100">Courses</span> 2026
            </h1>
            <p className="text-xl text-orange-100/90 max-w-3xl mx-auto leading-relaxed">
              Discover undergraduate, postgraduate, and professional courses across top colleges and universities in India
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses by name or ID..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>


            {/* View Toggle */}
            <div className="flex gap-2">
              <button className="p-2 border border-slate-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all">
                <Filter className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* All Courses */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px bg-orange-500 flex-1" />
              <h2 className="text-2xl font-bold text-slate-900">Available Courses</h2>
              <div className="h-px bg-orange-500 flex-1" />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-2">
                        {course.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-600">Colleges:</span>
                        <span className="text-xs font-semibold text-orange-600">{course.colleges?.length || 0}</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed mb-3">
                        {course.description}
                      </p>
                      
                      <AdmissionButton examName={course.name} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Find Your Perfect Course
          </h2>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            {filteredCourses.length} courses available
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold">
              Talk to Expert
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
              Browse All Colleges
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
