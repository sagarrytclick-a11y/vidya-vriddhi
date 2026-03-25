'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, MapPin, ArrowRight } from 'lucide-react'

interface CityCardProps {
  name: string
  icon: React.ReactNode
  collegesCount: number
}

const CityCard: React.FC<CityCardProps> = ({ name, icon, collegesCount }) => {
  return (
    <div className="shrink-0 w-40 bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:scale-105 cursor-pointer group">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 group-hover:bg-orange-100 transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
          <p className="text-sm text-gray-600">{collegesCount} Colleges</p>
        </div>
      </div>
    </div>
  )
}

const TopStudyPlaces: React.FC = () => {
  const cities = [
    {
      name: 'Delhi NCR',
      icon: <MapPin className="w-8 h-8" />,
      collegesCount: 856
    },
    {
      name: 'Bangalore',
      icon: <MapPin className="w-8 h-8" />,
      collegesCount: 623
    },
    {
      name: 'Hyderabad',
      icon: <MapPin className="w-8 h-8" />,
      collegesCount: 445
    },
    {
      name: 'Pune',
      icon: <MapPin className="w-8 h-8" />,
      collegesCount: 389
    },
    {
      name: 'Mumbai',
      icon: <MapPin className="w-8 h-8" />,
      collegesCount: 367
    },
    {
      name: 'Chennai',
      icon: <MapPin className="w-8 h-8" />,
      collegesCount: 298
    },
    {
      name: 'Kolkata',
      icon: <MapPin className="w-8 h-8" />,
      collegesCount: 276
    },
    {
      name: 'Jaipur',
      icon: <MapPin className="w-8 h-8" />,
      collegesCount: 234
    },
    {
      name: 'Lucknow',
      icon: <MapPin className="w-8 h-8" />,
      collegesCount: 198
    },
    {
      name: 'Ahmedabad',
      icon: <MapPin className="w-8 h-8" />,
      collegesCount: 187
    }
  ]

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
          <h2 className="text-3xl font-bold text-gray-900">Top Study Places</h2>
          <button className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium">
            <span>Explore all cities</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Cities Horizontal Scroll */}
        <div className="relative">
          <div className="flex items-center space-x-4">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-full bg-white shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div
              id="cities-scroll-container"
              className="flex space-x-4 overflow-x-auto pb-4 scroll-smooth flex-1"
            >
              {cities.map((city, index) => (
                <CityCard key={index} {...city} />
              ))}
            </div>
            
            <button
              onClick={scrollRight}
              className="p-2 rounded-full bg-white shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopStudyPlaces
