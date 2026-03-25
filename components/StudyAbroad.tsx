'use client'

import React from 'react'
import { Globe, DollarSign, Building, ChevronRight, ArrowRight } from 'lucide-react'

interface CountryCardProps {
  country: string
  flag: string
  collegesCount: string
  averageCost: string
  guides: string[]
}

const CountryCard: React.FC<CountryCardProps> = ({ country, flag, collegesCount, averageCost, guides }) => {
  return (
    <div className="shrink-0 w-96 bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="text-3xl">{flag}</div>
          <h3 className="text-2xl font-bold text-gray-900">Study in {country}</h3>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Colleges</p>
              <p className="font-semibold text-gray-900">{collegesCount}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Avg. Study Cost</p>
              <p className="font-semibold text-gray-900">{averageCost}</p>
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
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
            <Globe className="w-5 h-5" />
            <span>Explore {country}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const StudyAbroad: React.FC = () => {
  const countries = [
    {
      country: 'USA',
      flag: '🇺🇸',
      collegesCount: '5,300+',
      averageCost: '₹25L - ₹50L',
      guides: [
        'USA Student Visa Guide',
        'Cost of Living in USA',
        'Best Universities in USA',
        'Scholarships in USA',
        'Jobs after Study in USA'
      ]
    },
    {
      country: 'UK',
      flag: '🇬🇧',
      collegesCount: '2,800+',
      averageCost: '₹15L - ₹35L',
      guides: [
        'UK Student Visa Guide',
        'Cost of Living in UK',
        'Best Universities in UK',
        'Scholarships in UK',
        'Jobs after Study in UK'
      ]
    },
    {
      country: 'Canada',
      flag: '🇨🇦',
      collegesCount: '2,200+',
      averageCost: '₹12L - ₹30L',
      guides: [
        'Canada Student Visa Guide',
        'Cost of Living in Canada',
        'Best Universities in Canada',
        'Scholarships in Canada',
        'Jobs after Study in Canada'
      ]
    },
    {
      country: 'Australia',
      flag: '🇦🇺',
      collegesCount: '1,800+',
      averageCost: '₹15L - ₹35L',
      guides: [
        'Australia Student Visa Guide',
        'Cost of Living in Australia',
        'Best Universities in Australia',
        'Scholarships in Australia',
        'Jobs after Study in Australia'
      ]
    },
    {
      country: 'Germany',
      flag: '🇩🇪',
      collegesCount: '1,500+',
      averageCost: '₹5L - ₹15L',
      guides: [
        'Germany Student Visa Guide',
        'Cost of Living in Germany',
        'Best Universities in Germany',
        'Scholarships in Germany',
        'Jobs after Study in Germany'
      ]
    },
    {
      country: 'New Zealand',
      flag: '🇳🇿',
      collegesCount: '800+',
      averageCost: '₹12L - ₹25L',
      guides: [
        'New Zealand Student Visa Guide',
        'Cost of Living in New Zealand',
        'Best Universities in New Zealand',
        'Scholarships in New Zealand',
        'Jobs after Study in New Zealand'
      ]
    }
  ]

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
          <h2 className="text-3xl font-bold text-gray-900">Study Abroad</h2>
          <button className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium">
            <span>View all countries</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Country Cards Horizontal Scroll */}
        <div className="relative">
          <div
            id="study-abroad-scroll-container"
            className="flex space-x-6 overflow-x-auto pb-4 scroll-smooth"
          >
            {countries.map((countryData, index) => (
              <CountryCard key={index} {...countryData} />
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
      </div>
    </div>
  )
}

export default StudyAbroad
