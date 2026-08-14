'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, MapPin, Building2, Award, BookOpen, Loader2, Globe2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SearchInput } from '@/components/SearchInput'
import { CollegeActionButtons } from '@/components/college/CollegeActionButtons'
import { usePublicColleges } from '@/hooks/usePublicColleges'
import { useCollegesFilters } from '@/hooks/useCollegesFilters'

function buildFilterUrl(
  baseUrl: string,
  currentParams: URLSearchParams,
  newParams: Record<string, string | undefined>
) {
  const params = new URLSearchParams(currentParams)

  Object.entries(newParams).forEach(([key, value]) => {
    if (value) params.set(key, value)
    else params.delete(key)
  })

  if (Object.keys(newParams).some((k) => k !== 'page')) {
    params.delete('page')
  }

  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

function labelFromSlug(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function ListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200" />
      ))}
    </div>
  )
}

function CollegesPageContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category') || undefined
  const courseParam = searchParams.get('course') || undefined
  const cityParam = searchParams.get('city') || undefined
  const examParam = searchParams.get('exam') || undefined
  const searchParam = searchParams.get('search') || undefined
  const pageParam = searchParams.get('page') || undefined

  const { colleges, pagination, isLoading, isFetching, error } = usePublicColleges({
    category: categoryParam,
    course: courseParam,
    city: cityParam,
    exam: examParam,
    search: searchParam,
    page: pageParam,
  })

  const { categories, courses: filterCourses, cities, exams } = useCollegesFilters()

  const activeFilters: { key: string; name: string }[] = []
  if (categoryParam) {
    activeFilters.push({
      key: 'category',
      name: categories.find((c) => c.slug === categoryParam)?.name || labelFromSlug(categoryParam),
    })
  }
  if (courseParam) {
    activeFilters.push({
      key: 'course',
      name: filterCourses.find((c) => c.slug === courseParam)?.name || labelFromSlug(courseParam),
    })
  }
  if (cityParam) {
    activeFilters.push({
      key: 'city',
      name: cities.find((c) => c.slug === cityParam)?.name || labelFromSlug(cityParam),
    })
  }
  if (examParam) {
    activeFilters.push({
      key: 'exam',
      name: exams.find((e) => e.slug === examParam)?.name || labelFromSlug(examParam),
    })
  }
  if (searchParam) {
    activeFilters.push({ key: 'search', name: `"${searchParam}"` })
  }

  const baseUrl = '/colleges'
  const showListSkeleton = isLoading && colleges.length === 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-orange-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-y-1 text-[15px] font-medium"
          >
            <Link href="/" className="text-slate-700 transition-colors hover:text-orange-600">
              Home
            </Link>
            <ChevronRight className="mx-2 h-4 w-4 shrink-0 text-orange-400" />
            <span className="font-semibold text-orange-600">Colleges</span>
            {categoryParam && (
              <>
                <ChevronRight className="mx-2 h-4 w-4 shrink-0 text-orange-400" />
                <span className="font-semibold text-slate-900">
                  {categories.find((c) => c.slug === categoryParam)?.name ||
                    labelFromSlug(categoryParam)}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full max-w-md sm:w-auto">
            <SearchInput placeholder="Search Indian colleges..." />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">All Indian Colleges</h1>
            {isFetching && !showListSkeleton && (
              <Loader2 className="h-4 w-4 animate-spin text-orange-500" aria-label="Updating results" />
            )}
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Active Filters:</span>
            {activeFilters.map((filter) => (
              <Link
                key={filter.key}
                href={buildFilterUrl(baseUrl, searchParams, { [filter.key]: '' })}
                className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700 hover:bg-orange-200"
              >
                {filter.name}
                <span className="text-orange-500">×</span>
              </Link>
            ))}
            <Link href={baseUrl} className="ml-2 text-sm text-blue-600 hover:text-blue-700">
              Reset All
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-72">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Filter By</h2>
                  <Link href={baseUrl} className="text-sm text-blue-600 hover:text-blue-700">
                    Reset All
                  </Link>
                </div>

                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-medium text-gray-700">Streams</h3>
                  <div className="max-h-48 space-y-1 overflow-y-auto">
                    {categories.length === 0 ? (
                      <p className="px-3 py-2 text-sm text-gray-400">Loading…</p>
                    ) : (
                      categories.map((category) => {
                        const isActive = categoryParam === category.slug
                        return (
                          <Link
                            key={category.id}
                            href={buildFilterUrl(baseUrl, searchParams, {
                              category: isActive ? '' : category.slug,
                            })}
                            prefetch={false}
                            className={`flex items-center justify-between rounded px-3 py-2 text-[15px] font-semibold ${
                              isActive
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-black hover:bg-gray-50'
                            }`}
                          >
                            <span>{category.name}</span>
                          </Link>
                        )
                      })
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-medium text-gray-700">Courses</h3>
                  <div className="max-h-48 space-y-1 overflow-y-auto">
                    {filterCourses.slice(0, 12).map((course) => {
                      const isActive = courseParam === course.slug
                      return (
                        <Link
                          key={course.id}
                          href={buildFilterUrl(baseUrl, searchParams, {
                            course: isActive ? '' : course.slug,
                          })}
                          prefetch={false}
                          className={`flex items-center justify-between rounded px-3 py-2 text-[15px] font-semibold ${
                            isActive
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-black hover:bg-gray-50'
                          }`}
                        >
                          <span>{course.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-medium text-gray-700">Cities</h3>
                  <div className="max-h-48 space-y-1 overflow-y-auto">
                    {cities.slice(0, 15).map((city) => {
                      const isActive = cityParam === city.slug
                      return (
                        <Link
                          key={city.id}
                          href={buildFilterUrl(baseUrl, searchParams, {
                            city: isActive ? '' : city.slug,
                          })}
                          prefetch={false}
                          className={`flex items-center justify-between rounded px-3 py-2 text-[15px] font-semibold ${
                            isActive
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-black hover:bg-gray-50'
                          }`}
                        >
                          <span>{city.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <h3 className="mb-3 text-sm font-medium text-gray-700">Exams</h3>
                  <div className="max-h-48 space-y-1 overflow-y-auto">
                    {exams.slice(0, 10).map((exam) => {
                      const isActive = examParam === exam.slug
                      return (
                        <Link
                          key={exam.id}
                          href={buildFilterUrl(baseUrl, searchParams, {
                            exam: isActive ? '' : exam.slug,
                          })}
                          prefetch={false}
                          className={`flex items-center justify-between rounded px-3 py-2 text-[15px] font-semibold ${
                            isActive
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-black hover:bg-gray-50'
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

          <main className="relative flex-1">
            {error && colleges.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    Error loading colleges
                  </h3>
                  <p className="text-gray-500">{error}</p>
                </CardContent>
              </Card>
            ) : showListSkeleton ? (
              <ListSkeleton />
            ) : colleges.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900">No colleges found</h3>
                  <p className="text-gray-500">
                    Try adjusting your filters or reset them to see all colleges.
                  </p>
                  <Link href={baseUrl}>
                    <Button variant="outline" className="mt-4">
                      Reset Filters
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div
                className={`space-y-4 transition-opacity ${isFetching ? 'opacity-60' : 'opacity-100'}`}
              >
                {pagination.total > 0 && (
                  <p className="text-sm text-gray-500">
                    Showing {colleges.length} of {pagination.total} colleges
                  </p>
                )}

                {colleges.map((college) => (
                  <Card
                    key={college.id}
                    className="overflow-hidden transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <Link
                          href={`/colleges/${college.slug}`}
                          className="flex min-w-0 flex-1 flex-col md:flex-row"
                        >
                          <div className="shrink-0 p-4 md:w-24">
                            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                              {college.logoURL ? (
                                <Image
                                  src={college.logoURL}
                                  alt={college.name}
                                  width={64}
                                  height={64}
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <Building2 className="h-8 w-8 text-gray-400" />
                              )}
                            </div>
                          </div>

                          <div className="flex-1 p-4 pt-0 md:pt-4">
                            <h3 className="mb-1 text-[20px] font-semibold text-gray-900 hover:text-blue-600">
                              {college.name}
                            </h3>
                            <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                              {college.city?.name && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {college.city.name}
                                  {college.country?.name ? `, ${college.country.name}` : ''}
                                </span>
                              )}
                              {college.establishment_year && (
                                <>
                                  <span>•</span>
                                  <span>Est. {college.establishment_year}</span>
                                </>
                              )}
                            </div>

                            {college.description && (
                              <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-600">
                                {college.description}
                              </p>
                            )}

                            <div className="mb-3 flex flex-wrap gap-2">
                              {college.categories?.map((cat) => (
                                <Badge key={cat.id} variant="secondary" className="text-xs">
                                  {cat.name}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4 text-orange-500" />
                                <span>{college._count.courses} Courses</span>
                              </div>
                              {college.Countryranking && (
                                <div className="flex items-center gap-1">
                                  <Award className="h-4 w-4 text-orange-500" />
                                  <span>Rank #{college.Countryranking}</span>
                                </div>
                              )}
                              {college.Internationalranking && (
                                <div className="flex items-center gap-1">
                                  <Globe2 className="h-4 w-4 text-orange-500" />
                                  <span>QS #{college.Internationalranking}</span>
                                </div>
                              )}
                            </div>

                            {college.courses && college.courses.length > 0 && (
                              <div className="mt-2.5 flex flex-wrap gap-1.5">
                                {college.courses.slice(0, 3).map((course) => (
                                  <span
                                    key={course.id}
                                    className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600"
                                  >
                                    {course.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </Link>

                        <div
                          className="flex shrink-0 gap-2 p-4 md:items-start"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CollegeActionButtons
                            collegeSlug={college.slug}
                            college={college}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {pagination.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    {pagination.hasPrev && (
                      <Link
                        href={buildFilterUrl(baseUrl, searchParams, {
                          page: (pagination.page - 1).toString(),
                        })}
                        className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Previous
                      </Link>
                    )}
                    <span className="text-sm text-gray-600">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    {pagination.hasNext && (
                      <Link
                        href={buildFilterUrl(baseUrl, searchParams, {
                          page: (pagination.page + 1).toString(),
                        })}
                        className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <ListSkeleton />
          </div>
        </div>
      }
    >
      <CollegesPageContent />
    </Suspense>
  )
}
