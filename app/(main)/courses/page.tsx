'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, BookOpen, GraduationCap, Clock, Users, Star, Award, MapPin, ChevronRight, ChevronLeft, Sparkles, TrendingUp, Building2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { AdmissionButton } from '@/components/ui/AdmissionButton'
import { useCoursesByCategory } from '@/hooks/useCourses'

export default function CoursesPage() {
  const [page, setPage] = useState(1)
  const { courses: featuredCourses, pagination, isLoading, error } = useCoursesByCategory(undefined, page, 9)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filteredCourses = featuredCourses.filter((course: any) => {
    const matchesSearch = searchTerm === '' || 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.slug.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-white flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Courses</h2>
          <p className="text-slate-600 mb-4">Failed to load courses. Please try again.</p>
          <Button onClick={() => window.location.reload()} className="bg-orange-500 hover:bg-orange-600">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <BookOpen className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Loading <span className="text-orange-500">Courses</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Fetching available courses for you...
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-slate-100 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-slate-100 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded w-full"></div>
                    <div className="h-3 bg-slate-100 rounded w-2/3"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Explore 1000+ Courses</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Find Your <span className="text-amber-200">Perfect</span> Course
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto leading-relaxed mb-8">
              Discover undergraduate, postgraduate, and professional courses across top colleges and universities in India
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-orange-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-medium">Expert Guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="font-medium">Top Colleges</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <span className="font-medium">Verified Courses</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses, programs, specializations..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-700 placeholder:text-slate-400"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="px-4 py-4 h-auto border-slate-200 hover:border-orange-500 hover:bg-orange-50 rounded-xl">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </Button>
            </div>
          </div>
          {pagination && (
            <div className="mt-3 text-sm text-slate-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} courses
            </div>
          )}
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Available Courses</h2>
              <p className="text-slate-600">Explore our wide range of professional courses</p>
            </div>
            {filteredCourses.length > 0 && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 px-4 py-2 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                {filteredCourses.length} Courses
              </Badge>
            )}
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No courses found</h3>
              <p className="text-slate-600 mb-4">Try adjusting your search terms</p>
              <Button onClick={() => setSearchTerm('')} variant="outline">
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <Card key={course.id} className="group relative bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden">
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardContent className="relative p-6">
                    {/* Course Icon */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="w-7 h-7 text-orange-600" />
                      </div>
                      <Badge variant="secondary" className="bg-green-50 text-green-700 border-0">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>

                    {/* Course Info */}
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {course.name}
                    </h3>
                    
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {course.description || 'Explore this course to learn more about the curriculum, career opportunities, and admission process.'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Building2 className="w-4 h-4 text-orange-500" />
                        <span className="font-medium text-slate-700">{course.colleges?.length || 0}</span>
                        <span>Colleges</span>
                      </div>
                      <div className="w-1 h-1 bg-slate-300 rounded-full" />
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>2-4 Years</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-3">
                      <AdmissionButton examName={course.name} />
                      <Link href={`/courses/${course.slug}`}>
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-orange-600 hover:bg-orange-50">
                          Details
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center mt-12 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="h-11 px-5 border-slate-200 hover:border-orange-500 hover:bg-orange-50 rounded-xl"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                  let pageNum: number
                  if (pagination.totalPages <= 7) {
                    pageNum = i + 1
                  } else if (pagination.page <= 4) {
                    pageNum = i < 5 ? i + 1 : pagination.totalPages
                  } else if (pagination.page >= pagination.totalPages - 3) {
                    pageNum = i === 0 ? 1 : pagination.totalPages - 6 + i
                  } else {
                    pageNum = i === 0 ? 1 : i === 6 ? pagination.totalPages : pagination.page - 2 + i
                  }
                  
                  if (pagination.totalPages > 7 && (i === 5 && pageNum !== pagination.totalPages)) {
                    return <span key={`ellipsis-${i}`} className="px-2 text-slate-400">...</span>
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === pagination.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={
                        pageNum === pagination.page
                          ? "h-11 w-11 bg-orange-500 hover:bg-orange-600 text-white border-0 rounded-xl"
                          : "h-11 w-11 border-slate-200 hover:border-orange-500 hover:bg-orange-50 rounded-xl"
                      }
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="h-11 px-5 border-slate-200 hover:border-orange-500 hover:bg-orange-50 rounded-xl"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-500/20">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Get personalized guidance from our education experts and find the perfect course for your career goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25">
              <Users className="w-5 h-5 mr-2" />
              Talk to Expert
            </Button>
            <Link href="/colleges">
              <Button size="lg" variant="outline" className="h-14 px-8 border-slate-600 text-white hover:bg-white hover:text-slate-900 rounded-xl">
                Browse Colleges
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
