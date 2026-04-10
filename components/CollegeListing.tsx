'use client'

import React from 'react'
import { GraduationCap, MapPin, Award, Building2, ChevronRight, Globe } from 'lucide-react'
import { useIndianColleges } from '@/hooks/useIndianColleges'
import { useRouter } from 'next/navigation'

const CollegeListing: React.FC = () => {
  const { data: collegesData, isLoading, error } = useIndianColleges(1, 6)
  const router = useRouter()
  
  const colleges = collegesData?.colleges || []

  const handleCollegeClick = (slug: string) => {
    router.push(`/colleges/${slug}`)
  }

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {colleges.map((college) => (
              <div
                key={college.id}
                onClick={() => handleCollegeClick(college.slug)}
                className="group cursor-pointer bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:border-orange-200 transition-all duration-500 hover:-translate-y-2 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_-12px_rgba(249,115,22,0.15)]"
              >
                {/* Image Header Area */}
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={college.imageURL || 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop'} 
                    alt="Campus"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Soft Gradient Overlay for text readability on top images */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10" />
                  
                  {/* Floating Rank Badge */}
                  {college.Countryranking && (
                    <div className="absolute top-4 left-4 backdrop-blur-md bg-orange-600/90 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <Award className="w-3.5 h-3.5" />
                      RANK #{college.Countryranking}
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-8 pt-0 relative">
                  {/* Logo Overlay - White theme with clean border */}
                  <div className="relative -mt-12 mb-5 inline-block">
                    <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white p-3 shadow-xl overflow-hidden group-hover:border-orange-50 transition-colors">
                      <img
                        src={college.logoURL || '/placeholder-logo.png'}
                        alt={college.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {college.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 mb-5">
                    <div className="flex items-center text-gray-500 text-sm bg-gray-50 px-3 py-1 rounded-lg">
                      <MapPin className="w-4 h-4 mr-1.5 text-orange-500" />
                      {college.city?.name}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm bg-gray-50 px-3 py-1 rounded-lg">
                      <Globe className="w-4 h-4 mr-1.5 text-orange-400" />
                      {college.country?.name}
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                    {college.description || "A premier global institution recognized for excellence in academic research, innovative teaching methods, and strong industry placements."}
                  </p>

                  {/* Footer Action - Clean and Minimal */}
                  <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                    <span className="text-sm font-bold text-gray-400 group-hover:text-orange-600 transition-colors uppercase tracking-wider">
                      Explore Campus
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-500 transition-all duration-300">
                      <ChevronRight className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default CollegeListing