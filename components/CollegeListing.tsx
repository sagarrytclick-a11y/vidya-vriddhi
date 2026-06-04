'use client'

import React from 'react'
import { GraduationCap, MapPin, Award, Building2, ChevronRight, Globe } from 'lucide-react'
import { useIndianColleges } from '@/hooks/useIndianColleges'
import Link from 'next/link'

const CollegeListing: React.FC = () => {
  const { data: collegesData, isLoading, error } = useIndianColleges(1, 6)
  
  const colleges = collegesData?.colleges || []

  return (
    <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full mb-6 border border-orange-100">
            <GraduationCap className="w-5 h-5" />
            <span className="font-semibold tracking-wide uppercase text-xs">Featured Institutions</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Top Indian Colleges
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover the best educational institutions in India offering world-class education and opportunities.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mb-4"></div>
            <p className="text-gray-500 font-medium">Loading colleges...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white border border-red-100 rounded-3xl p-12 text-center shadow-sm">
            <Building2 className="w-16 h-16 text-red-200 mx-auto mb-4" />
            <p className="text-gray-900 font-bold text-xl mb-2">Unable to load colleges</p>
            <p className="text-gray-500">Please check your connection or try again later.</p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !error && colleges.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <Link
                key={college.id}
                href={`/colleges/${college.slug}`}
                className="group block bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg"
              >
                {/* Campus Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={college.imageURL || 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop'} 
                    alt="Campus"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {college.Countryranking && (
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Rank #{college.Countryranking}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Logo and Name */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-14 h-14 rounded-lg bg-gray-50 p-2 border border-gray-100 shrink-0">
                      <img
                        src={college.logoURL || '/placeholder-logo.png'}
                        alt={college.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/colleges/${college.slug}`}
                        className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 block"
                      >
                        {college.name}
                      </Link>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-orange-500" />
                          {college.city?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-gray-400" />
                          {college.country?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                    {college.description || "A premier institution recognized for academic excellence and strong industry placements."}
                  </p>

                  {/* View Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-500">View Details</span>
                    <ChevronRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default CollegeListing