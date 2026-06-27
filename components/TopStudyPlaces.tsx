'use client'

import React from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, MapPin, ArrowRight, Map as MapIcon, Building, ExternalLink } from 'lucide-react'
import { useCities } from '@/hooks/useCities'
import { CityWithStats } from '@/types/domain'
import { SkeletonPulse } from '@/components/ui/skeletons'
import Link from 'next/link'

interface CityCardProps {
  city: CityWithStats
}

const CityCard: React.FC<CityCardProps> = ({ city }) => {
  return (
    <div className="shrink-0 w-44 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
      {/* Image/Icon Banner */}
      <div className="h-32 bg-gradient-to-br from-orange-100 via-orange-50 to-blue-50 relative overflow-hidden">
        {city.cityImageURL ? (
          <Image
            src={city.cityImageURL}
            alt={city.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="176px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
              <MapPin className="w-8 h-8" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="p-4 text-center">
        <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors line-clamp-1">{city.name}</h3>
        <div className="flex items-center justify-center gap-1.5 text-sm text-gray-600">
          <Building className="w-3.5 h-3.5 text-orange-500" />
          <span className="font-medium">{city._count.colleges}</span>
          <span className="text-gray-400">Colleges</span>
        </div>
        {city.country.flagEmoji && (
          <div className="mt-2 text-2xl">{city.country.flagEmoji}</div>
        )}
      </div>
    </div>
  )
}

const TopStudyPlaces: React.FC = () => {
  // Fetch cities using custom hook
  const { data: response, isLoading, error } = useCities(100)
  const cities = (response?.data || []).filter(city => city.country?.slug === 'india')

  const scrollLeft = () => {
    const element = document.getElementById('cities-scroll-container')
    if (element) {
      element.scrollBy({ left: -180, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    const element = document.getElementById('cities-scroll-container')
    if (element) {
      element.scrollBy({ left: 180, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Top Study Places</h2>
          <Link href="/cities">
            <button className="flex items-center space-x-1 sm:space-x-2 text-orange-500 hover:text-orange-600 font-medium text-xs sm:text-sm">
              <span>Explore all cities</span>
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="relative">
            <div className="flex items-center space-x-4">
              <SkeletonPulse className="h-12 w-12 rounded-full hidden sm:block" />
              <div className="flex space-x-6 overflow-hidden flex-1 pb-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="shrink-0 w-44 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <SkeletonPulse className="h-32 w-full" />
                    <div className="p-4 space-y-3">
                      <SkeletonPulse className="h-4 w-3/4 mx-auto" />
                      <SkeletonPulse className="h-3 w-1/2 mx-auto" />
                      <SkeletonPulse className="h-8 w-10 mx-auto rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
              <SkeletonPulse className="h-12 w-12 rounded-full hidden sm:block" />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 text-center">
            <MapIcon className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Unable to load cities</p>
            <p className="text-gray-500 text-sm mt-1">Please try again later</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && cities && cities.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <MapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">No cities found</p>
            <p className="text-gray-500 text-sm mt-1">Cities will appear here once added to the database</p>
          </div>
        )}

        {/* Cities Horizontal Scroll */}
        {!isLoading && !error && cities && cities.length > 0 && (
          <div className="relative">
            <div className="flex items-center space-x-4">
              <button
                onClick={scrollLeft}
                className="p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              
              <div
                id="cities-scroll-container"
                className="flex space-x-6 overflow-x-auto pb-6 scroll-smooth flex-1"
              >
                {cities.map((city) => (
                  <CityCard key={city.id} city={city} />
                ))}
              </div>
              
              <button
                onClick={scrollRight}
                className="p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopStudyPlaces
