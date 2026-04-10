'use client'

import React from 'react'
import { Calendar, ArrowLeft, Newspaper } from 'lucide-react'
import { useNews } from '@/hooks/useNews'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const NewsPage: React.FC = () => {
  const { data: newsItems, isLoading, error } = useNews(50)
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  const handleNewsClick = (slug: string) => {
    router.push(`/news/${slug}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">All News</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 text-center">
            <Newspaper className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Unable to load news</p>
            <p className="text-gray-500 text-sm mt-1">Please try again later</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && newsItems && newsItems.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">No news found</p>
            <p className="text-gray-500 text-sm mt-1">News will appear here once added to the database</p>
          </div>
        )}

        {/* News Grid */}
        {!isLoading && !error && newsItems && newsItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((news) => (
              <button
                key={news.id}
                onClick={() => handleNewsClick(news.slug)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all text-left group"
              >
                {news.imageUrl && (
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(news.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {news.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {news.content}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-orange-500 text-sm font-medium group-hover:text-orange-600">
                    Read more →
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsPage
