'use client'

import React, { useState } from 'react'
import { ArrowUp, ArrowDown, Calendar, DollarSign, Info, ChevronLeft, ChevronRight, Building, ExternalLink } from 'lucide-react'
import { useIndianColleges } from '@/hooks/useIndianColleges'

interface College {
  id: string
  name: string
  slug: string
  description: string | null
  establishment_year: number | null
  Countryranking: number | null
  Internationalranking: number | null
  logoURL: string | null
  imageURL: string | null
  city: {
    name: string
    slug: string
  }
  country: {
    name: string
    flagEmoji: string | null
  }
  courses: {
    name: string
  }[]
  _count: {
    courses: number
  }
}

const TopColleges: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Fetch Indian colleges using custom hook
  const { data, isLoading, error } = useIndianColleges(currentPage, itemsPerPage)

  const colleges = data?.colleges || []
  const pagination = data?.pagination


  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Top Indian Colleges</h2>
            <p className="text-sm text-gray-500 mt-1">Ranked by national performance</p>
          </div>
          <button className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium">
            <span>Explore all colleges</span>
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 text-center">
            <Building className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Unable to load colleges</p>
            <p className="text-gray-500 text-sm mt-1">Please try again later</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && colleges.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">No Indian colleges found</p>
            <p className="text-gray-500 text-sm mt-1">Colleges will appear here once added to the database</p>
          </div>
        )}

        {/* Colleges Table */}
        {!isLoading && !error && colleges.length > 0 && (
          <>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        College Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Courses
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Established
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        National Rank
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {colleges.map((college, index) => (
                      <tr key={college.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold text-orange-600">
                            #{(currentPage - 1) * itemsPerPage + index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {college.logoURL && (
                              <img
                                src={college.logoURL}
                                alt={college.name}
                                className="w-10 h-10 rounded-lg object-contain"
                              />
                            )}
                            <div className="text-sm font-semibold text-black hover:text-orange-500 cursor-pointer">
                              {college.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-black">
                            {college.city.name}, {college.country.flagEmoji}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-black">
                            {college._count.courses} courses
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-black">
                            {college.establishment_year || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {college.Countryranking ? (
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                              #{college.Countryranking}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} colleges
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={!pagination.hasPrev}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
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
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={!pagination.hasNext}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight size={16} />
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
