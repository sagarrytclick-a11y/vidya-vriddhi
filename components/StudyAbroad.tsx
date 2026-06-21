'use client'

import React from 'react'
import { Globe, DollarSign, Building, ChevronRight, ArrowRight, Map as MapIcon, ExternalLink } from 'lucide-react'
import { useCountries } from '@/hooks/useCountries'
import { SkeletonPulse } from '@/components/ui/skeletons'
import Link from 'next/link'

interface Country {
  id: string
  name: string
  slug: string
  flagEmoji: string | null
  _count: {
    colleges: number
  }
}

interface CountryCardProps {
  country: Country
}

const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
  const guides = [
    `${country.name} Student Visa Guide`,
    `Cost of Living in ${country.name}`,
    `Best Universities in ${country.name}`,
    `Scholarships in ${country.name}`,
    `Jobs after Study in ${country.name}`
  ]

  return (
    <div className="shrink-0 w-72 sm:w-96 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="text-3xl">{country.flagEmoji || '🌍'}</div>
          <h3 className="text-2xl font-bold text-gray-900">Study in {country.name}</h3>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Colleges</p>
              <p className="font-semibold text-gray-900">{country._count.colleges}+</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Avg. Study Cost</p>
              <p className="font-semibold text-gray-900">Varies</p>
            </div>
          </div>
        </div>
        
        {/* Guides Section */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-3">Guides</h4>
          <div className="space-y-2">
            {guides.map((guide, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-orange-500 hover:text-orange-600 cursor-pointer">
                <ArrowRight className="w-4 h-4" />
                <span>{guide}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Explore Button */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link href={`/countries/${country.slug}`}>
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
              <Globe className="w-5 h-5" />
              <span>Explore {country.name}</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const StudyAbroad: React.FC = () => {
  // Fetch countries excluding India using custom hook
  const { data: countries, isLoading, error } = useCountries(true)

  const scrollRight = () => {
    const element = document.getElementById('study-abroad-scroll-container')
    if (element) {
      element.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Study Abroad</h2>
          <Link href="/countries">
            <button className="flex items-center space-x-1 sm:space-x-2 text-orange-500 hover:text-orange-600 font-medium text-xs sm:text-sm">
              <span>View all countries</span>
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex space-x-6 overflow-hidden pb-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="shrink-0 w-96 bg-white rounded-xl border border-gray-200 p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <SkeletonPulse className="h-8 w-8 rounded-full" />
                    <SkeletonPulse className="h-6 w-48" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <SkeletonPulse className="h-4 w-16" />
                      <SkeletonPulse className="h-5 w-12" />
                    </div>
                    <div className="space-y-2">
                      <SkeletonPulse className="h-4 w-24" />
                      <SkeletonPulse className="h-5 w-16" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <SkeletonPulse className="h-4 w-16" />
                    <SkeletonPulse className="h-4 w-full" />
                    <SkeletonPulse className="h-4 w-2/3" />
                  </div>
                  <SkeletonPulse className="h-11 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 text-center">
            <MapIcon className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Unable to load countries</p>
            <p className="text-gray-500 text-sm mt-1">Please try again later</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && countries && countries.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <MapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">No countries found</p>
            <p className="text-gray-500 text-sm mt-1">Countries will appear here once added to the database</p>
          </div>
        )}

        {/* Country Cards Horizontal Scroll */}
        {!isLoading && !error && countries && countries.length > 0 && (
          <div className="relative">
            <div
              id="study-abroad-scroll-container"
              className="flex space-x-6 overflow-x-auto pb-4 scroll-smooth"
            >
              {countries.map((country) => (
                <CountryCard key={country.id} country={country} />
              ))}
            </div>
            
            {/* Right Navigation Arrow */}
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudyAbroad
