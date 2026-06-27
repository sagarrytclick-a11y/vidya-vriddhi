'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useCollegesByCourse } from '@/hooks/useCollegesByCourse'
import { Building, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

const PER_PAGE = 5

const CollegeCards = () => {
  const [page, setPage] = useState(1)
  const { data: colleges, isLoading, error } = useCollegesByCourse('B.Tech')

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Top Colleges & Universities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 bg-gray-100 rounded-lg" />
                  <div className="h-16 bg-gray-100 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Building className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <p className="text-gray-600">Unable to load colleges. Please try again later.</p>
      </div>
    )
  }

  if (!colleges || colleges.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No B.Tech colleges found.</p>
      </div>
    )
  }

  const totalPages = Math.ceil(colleges.length / PER_PAGE)
  const paginatedColleges = colleges.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
        Top B.Tech Colleges
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedColleges.map((college) => (
          <Link
            key={college.id}
            href={college.slug ? `/colleges/${college.slug}` : '#'}
            className="group bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 block"
          >
            <div className="relative">
              <img
                src={college.imageURL || 'https://via.placeholder.com/400x200?text=College'}
                alt={college.name}
                className="w-full h-48 object-cover"
              />
              {college.Countryranking && (
                <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  #{college.Countryranking} in India
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink size={16} className="text-gray-700" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">{college.name}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {college.city?.name}, {college.country?.flagEmoji}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-blue-600 font-semibold">{college.Countryranking ? `#${college.Countryranking}` : 'N/A'}</div>
                  <div className="text-gray-600 text-xs">Rank</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-green-600 font-semibold">{college._count?.courses || 0} Courses</div>
                  <div className="text-gray-600 text-xs">Programs</div>
                </div>
              </div>
              <div className="space-y-2 text-sm mt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Est:</span>
                  <span className="font-semibold text-gray-800">{college.establishment_year || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Courses:</span>
                  <span className="font-semibold text-gray-800">
                    {college.courses?.slice(0, 2).map(c => c.name).join(', ') || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                page === i + 1
                  ? 'bg-orange-500 text-white'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default CollegeCards
