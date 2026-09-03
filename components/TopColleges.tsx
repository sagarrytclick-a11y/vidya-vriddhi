'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  ExternalLink,
  Search,
  X,
  MapPin,
  BookOpen,
  ArrowRight,
} from 'lucide-react'
import { useIndianColleges } from '@/hooks/useIndianColleges'
import { useCollegesFilters } from '@/hooks/useCollegesFilters'
import { TableSkeleton } from '@/components/ui/skeletons'
import Link from 'next/link'

const TopColleges: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const itemsPerPage = 10

  const { categories, courses, cities } = useCollegesFilters()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, selectedCategory, selectedCourse, selectedCity])

  const { data, isLoading, error } = useIndianColleges(
    currentPage,
    itemsPerPage,
    debouncedSearch || undefined,
    selectedCategory || undefined,
    selectedCourse || undefined,
    selectedCity || undefined
  )

  const colleges = data?.colleges || []
  const pagination = data?.pagination

  const clearSearch = () => {
    setSearchInput('')
    setDebouncedSearch('')
  }

  const clearFilters = () => {
    setSearchInput('')
    setDebouncedSearch('')
    setSelectedCategory('')
    setSelectedCourse('')
    setSelectedCity('')
    setCurrentPage(1)
  }

  const hasActiveFilters = debouncedSearch || selectedCategory || selectedCourse || selectedCity

  return (
    <div className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Top Indian Colleges</h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Browse colleges by courses, city & streams
            </p>
          </div>
          <Link
            href="/colleges"
            className="flex items-center gap-1 text-xs font-medium text-orange-500 hover:text-orange-600 sm:gap-2 sm:text-sm"
          >
            <span>Explore all colleges</span>
            <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search colleges..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-8 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="whitespace-nowrap rounded-lg border border-red-200 px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              Clear All
            </button>
          )}
        </div>

        {isLoading && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <TableSkeleton rows={6} columns={7} />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-8 text-center">
            <Building2 className="mx-auto mb-4 h-12 w-12 text-orange-500" />
            <p className="font-medium text-gray-700">Unable to load colleges</p>
            <p className="mt-1 text-sm text-gray-500">Please try again later</p>
          </div>
        )}

        {!isLoading && !error && colleges.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
            <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="font-medium text-gray-700">No Indian colleges found</p>
            <p className="mt-1 text-sm text-gray-500">
              {hasActiveFilters
                ? 'Try clearing filters or searching a different name'
                : 'Colleges will appear here once added to the database'}
            </p>
          </div>
        )}

        {!isLoading && !error && colleges.length > 0 && (
          <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500 sm:px-4 sm:py-4 sm:text-xs">
                        College
                      </th>
                      <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500 sm:px-4 sm:py-4 sm:text-xs">
                        City
                      </th>
                      <th className="hidden px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500 md:table-cell sm:px-4 sm:py-4 sm:text-xs">
                        Courses
                      </th>
                      <th className="hidden px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500 lg:table-cell sm:px-4 sm:py-4 sm:text-xs">
                        Established
                      </th>
                      <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500 sm:px-4 sm:py-4 sm:text-xs">
                        Streams
                      </th>
                      <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-gray-500 sm:px-4 sm:py-4 sm:text-xs">
                        NIRF Rank
                      </th>
                      <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-gray-500 sm:px-4 sm:py-4 sm:text-xs">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {colleges.map((college) => {
                      const courseCount = college._count?.courses || 0

                      return (
                        <tr
                          key={college.id}
                          className="transition-colors hover:bg-orange-50/40"
                        >
                          <td className="px-3 py-3 sm:px-4 sm:py-4">
                            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50 sm:h-11 sm:w-11">
                                {college.logoURL ? (
                                  <Image
                                    src={college.logoURL}
                                    alt={college.name}
                                    fill
                                    className="object-contain p-1"
                                    sizes="44px"
                                  />
                                ) : (
                                  <Building2 className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <Link
                                  href={`/colleges/${college.slug}`}
                                  className="line-clamp-2 text-[12px] font-semibold text-gray-900 hover:text-orange-600 sm:text-sm"
                                >
                                  {college.name}
                                </Link>
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-3 sm:px-4 sm:py-4">
                            <div className="flex min-w-0 items-center gap-1.5 text-xs text-gray-700 sm:text-sm">
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                              <span className="truncate font-medium">
                                {college.city?.name || '—'}
                              </span>
                            </div>
                          </td>

                          <td className="hidden px-3 py-3 md:table-cell sm:px-4 sm:py-4">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800 sm:text-sm">
                              <BookOpen className="h-3.5 w-3.5 text-orange-500" />
                              <span>
                                {courseCount} {courseCount === 1 ? 'course' : 'courses'}
                              </span>
                            </div>
                          </td>

                          <td className="hidden px-3 py-3 lg:table-cell sm:px-4 sm:py-4">
                            <span className="text-xs font-medium text-gray-700 sm:text-sm">
                              {college.establishment_year
                                ? `Est. ${college.establishment_year}`
                                : '—'}
                            </span>
                          </td>

                          <td className="px-3 py-3 sm:px-4 sm:py-4">
                            <div className="flex flex-wrap gap-1">
                              {college.categories && college.categories.length > 0 ? (
                                college.categories.slice(0, 2).map((cat: { id: string; name: string }) => (
                                  <span
                                    key={cat.id}
                                    className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 sm:text-xs"
                                  >
                                    {cat.name}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </div>
                          </td>

                          <td className="px-3 py-3 text-center sm:px-4 sm:py-4">
                            {college.Countryranking ? (
                              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200 sm:text-xs">
                                #{college.Countryranking}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </td>

                          <td className="px-3 py-3 text-right sm:px-4 sm:py-4">
                            <Link
                              href={`/colleges/${college.slug}`}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#F27121] px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#E05A1B] sm:px-3 sm:text-xs"
                            >
                              View
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-0">
                <div className="text-center text-xs text-gray-600 sm:text-left sm:text-sm">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, pagination.total)} of{' '}
                  {pagination.total} colleges
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={!pagination.hasPrev}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
                  >
                    <ChevronLeft size={14} className="sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(3, pagination.totalPages) }, (_, i) => {
                      let pageNum
                      if (pagination.totalPages <= 3) {
                        pageNum = i + 1
                      } else if (currentPage <= 2) {
                        pageNum = i + 1
                      } else if (currentPage >= pagination.totalPages - 1) {
                        pageNum = pagination.totalPages - 2 + i
                      } else {
                        pageNum = currentPage - 1 + i
                      }

                      return (
                        <button
                          type="button"
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors sm:h-10 sm:w-10 sm:text-sm ${
                            currentPage === pageNum
                              ? 'bg-orange-500 text-white'
                              : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))
                    }
                    disabled={!pagination.hasNext}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={14} className="sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TopColleges
