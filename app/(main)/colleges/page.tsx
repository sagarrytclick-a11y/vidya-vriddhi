'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, MapPin, Building2, GraduationCap, Award, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SearchInput } from '@/components/SearchInput'
import { CollegeActionButtons } from '@/components/college/CollegeActionButtons'
import CompareButton from '@/components/ui/compare-button'
import { usePublicColleges } from '@/hooks/usePublicColleges'
import { useCollegesFilters } from '@/hooks/useCollegesFilters'

function buildFilterUrl(baseUrl: string, currentParams: URLSearchParams, newParams: Record<string, string | undefined>) {
  const params = new URLSearchParams(currentParams)

  // Add/update new params
  Object.entries(newParams).forEach(([key, value]) => {
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
  })

  // Remove page when filter changes
  if (Object.keys(newParams).some(k => k !== 'page')) {
    params.delete('page')
  }

  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

function CollegesPageContent() {
  const searchParams = useSearchParams()
  const { colleges, pagination, isLoading, error } = usePublicColleges({
    category: searchParams.get('category') || undefined,
    course: searchParams.get('course') || undefined,
    city: searchParams.get('city') || undefined,
    exam: searchParams.get('exam') || undefined,
    search: searchParams.get('search') || undefined,
    page: searchParams.get('page') || undefined,
  })
  const { categories, courses: filterCourses, cities, exams, isLoading: filtersLoading } = useCollegesFilters()

  // Get active filter names for display
  const activeFilters: { key: string; name: string; slug: string }[] = []
  if (searchParams.get('category')) {
    const cat = categories.find(c => c.slug === searchParams.get('category'))
    if (cat) activeFilters.push({ key: 'category', name: cat.name, slug: cat.slug })
  }
  if (searchParams.get('course')) {
    const course = filterCourses.find(c => c.slug === searchParams.get('course'))
    if (course) activeFilters.push({ key: 'course', name: course.name, slug: course.slug })
  }
  if (searchParams.get('city')) {
    const city = cities.find(c => c.slug === searchParams.get('city'))
    if (city) activeFilters.push({ key: 'city', name: city.name, slug: city.slug })
  }
  if (searchParams.get('exam')) {
    const exam = exams.find(e => e.slug === searchParams.get('exam'))
    if (exam) activeFilters.push({ key: 'exam', name: exam.name, slug: exam.slug })
  }
  if (searchParams.get('search')) {
    activeFilters.push({ key: 'search', name: `"${searchParams.get('search')}"`, slug: searchParams.get('search') || '' })
  }

  const baseUrl = '/colleges'

  // Show loading skeleton while data is loading
  if (isLoading || filtersLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="flex gap-4">
              <div className="w-72 h-96 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Colleges</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium">Colleges</span>
            {searchParams.get('category') && (
              <>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-blue-600 font-medium">
                  {categories.find(c => c.slug === searchParams.get('category'))?.name}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search Input with Debounce */}
          <div className="max-w-md w-full sm:w-auto">
            <SearchInput placeholder="Search Indian colleges..." />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            All Indian Colleges
          </h1>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-sm text-gray-500">Active Filters:</span>
            {activeFilters.map((filter) => (
              <Link
                key={filter.key}
                href={buildFilterUrl(baseUrl, searchParams, { [filter.key]: '' })}
                className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200"
              >
                {filter.name}
                <span className="text-orange-500">×</span>
              </Link>
            ))}
            <Link
              href={baseUrl}
              className="text-sm text-blue-600 hover:text-blue-700 ml-2"
            >
              Reset All
            </Link>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Filter By</h2>
                  <Link href={baseUrl} className="text-sm text-blue-600 hover:text-blue-700">
                    Reset All
                  </Link>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Streams</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((category: any) => {
                      const isActive = searchParams.get('category') === category.slug
                      const count = colleges.filter((c: any) => c.categories?.some?.((cat: any) => cat.id === category.id)).length
                      return (
                        <Link
                          key={category.id}
                          href={buildFilterUrl(baseUrl, searchParams, { category: isActive ? '' : category.slug })}
                          className={`flex items-center justify-between py-2 px-3 rounded text-[16px] font-semibold ${isActive ? 'bg-blue-50 text-blue-700' : 'text-black hover:bg-gray-50'
                            }`}
                        >
                          <span>{category.name}</span>
                          {count > 0 && <span className="text-gray-500 text-sm font-medium">({count})</span>}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Courses */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Courses</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {filterCourses.slice(0, 10).map((course: any) => {
                      const isActive = searchParams.get('course') === course.slug
                      return (
                        <Link
                          key={course.id}
                          href={buildFilterUrl(baseUrl, searchParams, { course: isActive ? '' : course.slug })}
                          className={`flex items-center justify-between py-2 px-3 rounded text-[16px] font-semibold ${isActive ? 'bg-blue-50 text-blue-700' : 'text-black hover:bg-gray-50'
                            }`}
                        >
                          <span>{course.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Cities */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Cities</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {cities.slice(0, 15).map((city: any) => {
                      const isActive = searchParams.get('city') === city.slug
                      return (
                        <Link
                          key={city.id}
                          href={buildFilterUrl(baseUrl, searchParams, { city: isActive ? '' : city.slug })}
                          className={`flex items-center justify-between py-2 px-3 rounded text-[16px] font-semibold ${isActive ? 'bg-blue-50 text-blue-700' : 'text-black hover:bg-gray-50'
                            }`}
                        >
                          <span>{city.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Exams */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Exams</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {exams.slice(0, 10).map((exam: any) => {
                      const isActive = searchParams.get('exam') === exam.slug
                      return (
                        <Link
                          key={exam.id}
                          href={buildFilterUrl(baseUrl, searchParams, { exam: isActive ? '' : exam.slug })}
                          className={`flex items-center justify-between py-2 px-3 rounded text-[16px] font-semibold ${isActive ? 'bg-blue-50 text-blue-700' : 'text-black hover:bg-gray-50'
                            }`}
                        >
                          <span>{exam.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {colleges.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No colleges found</h3>
                  <p className="text-gray-500">Try adjusting your filters or reset them to see all colleges.</p>
                  <Link href={baseUrl}>
                    <Button variant="outline" className="mt-4">Reset Filters</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {colleges.map((college) => (
                  <Card key={college.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <Link href={`/colleges/${college.slug}`} className="flex flex-col md:flex-row">
                        {/* Logo Section */}
                        <div className="p-4 md:w-24 shrink-0">
                          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                            {college.logoURL ? (
                              <Image
                                src={college.logoURL}
                                alt={college.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Building2 className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 p-4 pt-0 md:pt-4">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-[20px] font-semibold text-gray-900 mb-1 block group-hover:text-blue-600">
                                {college.name}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {college.city?.name}
                                </span>
                                <span>•</span>
                                <span>Private</span>
                                {college.establishment_year && (
                                  <>
                                    <span>•</span>
                                    <span>Est. {college.establishment_year}</span>
                                  </>
                                )}
                              </div>

                              {/* Categories */}
                              <div className="flex flex-wrap gap-2 mb-3">
                                {college.categories?.map((cat: any) => (
                                  <Badge key={cat.id} variant="secondary" className="text-xs">
                                    {cat.name}
                                  </Badge>
                                ))}
                              </div>

                              {/* Courses */}
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1 text-gray-600">
                                  <BookOpen className="w-4 h-4 text-orange-500" />
                                  <span>{college._count.courses} Courses</span>
                                </div>
                                {college.Countryranking && (
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <Award className="w-4 h-4 text-orange-500" />
                                    <span>Rank #{college.Countryranking}</span>
                                  </div>
                                )}
                              </div>

                              {/* Quick Links */}
                              <div className="flex gap-4 mt-3 text-sm text-blue-600">
                                <span>Admission</span>
                                <span>•</span>
                                <span>Courses</span>
                                <span>•</span>
                                <span>Scholarship</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <CollegeActionButtons collegeSlug={college.slug} college={college} />
                            </div>
                          </div>
                        </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    {pagination.hasPrev && (
                      <Link
                        href={buildFilterUrl(baseUrl, searchParams, { page: (pagination.page - 1).toString() })}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
                      >
                        Previous
                      </Link>
                    )}
                    <span className="text-sm text-gray-600">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    {pagination.hasNext && (
                      <Link
                        href={buildFilterUrl(baseUrl, searchParams, { page: (pagination.page + 1).toString() })}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function CollegesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="flex gap-4">
              <div className="w-72 h-96 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <CollegesPageContent />
    </Suspense>
  )
}
