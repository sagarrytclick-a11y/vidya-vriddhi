'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Search, TrendingUp, X, Building, FileText, Newspaper, BookOpen, ChevronRight } from 'lucide-react'
import { useSearch } from '@/hooks/useSearch'
import { useRouter } from 'next/navigation'
import { SkeletonPulse } from '@/components/ui/skeletons'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const { data: searchResults, isLoading } = useSearch(searchQuery, 10)

  const popularSearches = [
    { name: 'IIMA', category: 'College', trending: true },
    { name: 'IIT Bombay', category: 'College', trending: true },
    { name: 'AIIMS Delhi', category: 'College', trending: true },
    { name: 'JEE Main', category: 'Exam', trending: true },
    { name: 'GATE', category: 'Exam', trending: true },
    { name: 'CAT', category: 'Exam', trending: true },
    { name: 'Master of Business Administration (MBA)', category: 'Course', trending: true },
    { name: 'Bachelor of Technology (B.Tech)', category: 'Course', trending: false },
    { name: 'NEET', category: 'Exam', trending: true },
    { name: 'Delhi University', category: 'College', trending: false }
  ]

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleItemClick = (result: { type: string; slug: string }) => {
    const routeMap: Record<string, string> = {
      College: '/colleges/',
      Exam: '/exams/',
      News: '/news/',
      Course: '/courses/',
    }
    const prefix = routeMap[result.type] || '/colleges/'
    router.push(`${prefix}${result.slug}`)
    onClose()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'College':
        return Building
      case 'Exam':
        return FileText
      case 'News':
        return Newspaper
      case 'Course':
        return BookOpen
      default:
        return Search
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'College':
        return 'bg-blue-100 text-blue-600'
      case 'Exam':
        return 'bg-green-100 text-green-600'
      case 'News':
        return 'bg-purple-100 text-purple-600'
      case 'Course':
        return 'bg-orange-100 text-orange-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[120] bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Search</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="What Are You Looking For?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-4 py-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xl"
          />
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3">
                    <SkeletonPulse className="w-14 h-14 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <SkeletonPulse className="h-4 w-3/4" />
                      <SkeletonPulse className="h-3 w-1/2" />
                    </div>
                    <SkeletonPulse className="w-5 h-5 rounded-full" />
                  </div>
                ))}
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div>
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <p className="text-sm text-gray-600">Found {searchResults.length} results</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {searchResults.map((result) => {
                    const TypeIcon = getTypeIcon(result.type)
                    const typeColor = getTypeColor(result.type)

                    return (
                      <button
                        key={result.id}
                        onClick={() => handleItemClick(result)}
                        className="w-full flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        {/* Image */}
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          {result.image ? (
                            <Image
                              src={result.image}
                              alt={result.name}
                              fill
                              className="object-contain p-1"
                              sizes="56px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <TypeIcon className="w-7 h-7 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-base font-semibold text-gray-900 truncate">{result.name}</h4>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${typeColor}`}>
                              {result.type}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            {result.flag && <span>{result.flag}</span>}
                            <span className="truncate">{result.additionalInfo}</span>
                          </div>
                        </div>

                        {/* Arrow */}
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No results found for &ldquo;{searchQuery}&rdquo;</p>
                <p className="mt-1 text-sm text-gray-400">Try different keywords or check spelling</p>
              </div>
            )}
          </div>
        )}

        {/* Popular Searches - Show only when no search query */}
        {!searchQuery && (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-semibold text-gray-900">Popular Searches</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularSearches.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(item.name)}
                  className="flex items-center justify-between p-4 text-left hover:bg-white rounded-lg transition-colors group border border-gray-200 hover:border-orange-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <div>
                      <span className="text-gray-900 group-hover:text-orange-600 font-medium text-base">
                        {item.name}
                      </span>
                      <span className="text-gray-500 text-sm ml-2 block">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  {item.trending && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                      Trending
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Quick Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-4">
                <span className="text-base text-gray-600 font-medium">Quick links:</span>
                {['Engineering Colleges', 'MBA Colleges', 'Medical Colleges', 'Law Colleges'].map((link, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(link)}
                    className="text-base text-orange-500 hover:text-orange-600 font-medium"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchOverlay
