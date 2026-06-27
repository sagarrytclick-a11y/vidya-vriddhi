'use client'

import React from 'react'
import Image from 'next/image'
import { Calendar, ArrowRight, ChevronRight, Newspaper, ExternalLink } from 'lucide-react'
import { useNews } from '@/hooks/useNews'
import { SkeletonPulse } from '@/components/ui/skeletons'

interface News {
  id: string
  title: string
  slug: string
  content: string
  imageUrl: string | null
  createdAt: string
}

interface NewsCardProps {
  news: News
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const formattedDate = new Date(news.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div className="shrink-0 w-72 sm:w-96 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
        {news.imageUrl && (
          <div className="relative w-full h-48 overflow-hidden rounded-lg mb-4">
            <Image
              src={news.imageUrl}
              alt={news.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 384px"
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight line-clamp-2">{news.title}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {news.content}
          </p>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <button className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium text-sm">
            <span>Read more</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

const LatestNewsStories: React.FC = () => {
  // Fetch news using custom hook
  const { data: newsData, isLoading, error } = useNews(10)
  const newsItems = newsData?.data || []

  const scrollRight = () => {
    const element = document.getElementById('news-scroll-container')
    if (element) {
      element.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Latest News & Stories</h2>
          <button className="flex items-center space-x-1 sm:space-x-2 text-orange-500 hover:text-orange-600 font-medium text-xs sm:text-sm">
            <span>View all news</span>
             <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex space-x-6 overflow-hidden pb-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="shrink-0 w-96 bg-white rounded-xl border border-gray-200 p-6">
                <div className="space-y-4">
                  <SkeletonPulse className="w-full h-48 rounded-lg" />
                  <SkeletonPulse className="h-5 w-3/4" />
                  <SkeletonPulse className="h-4 w-1/3" />
                  <SkeletonPulse className="h-4 w-full" />
                  <SkeletonPulse className="h-4 w-2/3" />
                  <SkeletonPulse className="h-8 w-32" />
                </div>
              </div>
            ))}
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

        {/* News Cards Horizontal Scroll */}
        {!isLoading && !error && newsItems && newsItems.length > 0 && (
          <div className="relative">
            <div
              id="news-scroll-container"
              className="flex space-x-6 overflow-x-auto pb-4 scroll-smooth"
            >
              {newsItems.map((news) => (
                <NewsCard key={news.id} news={news} />
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

export default LatestNewsStories
