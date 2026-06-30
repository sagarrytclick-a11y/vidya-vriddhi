'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Bell, X, Newspaper } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa6'
import { useNews } from '@/hooks/useNews'
import { useRouter } from 'next/navigation'

const FloatingActions: React.FC = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const { data: newsData } = useNews(3)
  const newsItems = newsData?.data || []
  const router = useRouter()

  const handleWhatsAppClick = () => {
    const phoneNumber = '919839865347'
    const message = 'Hello, I have a question about Vidya Vriddhi.'
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleNewsClick = (slug: string) => {
    router.push(`/news/${slug}`)
    setIsNotificationOpen(false)
  }

  const handleViewAllNews = () => {
    router.push('/news')
    setIsNotificationOpen(false)
  }

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-3 sm:left-6 z-50 flex items-end space-x-4">
      {/* Action Buttons */}
      <div className="flex flex-col space-y-2 sm:space-y-3">
        {/* Notification Button */}
        <button
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          className="w-11 h-11 sm:w-14 sm:h-14 bg-orange-500 hover:bg-orange-600 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 group relative"
          title="Latest News"
        >
          <Bell className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
          {newsItems && newsItems.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-medium">
              {newsItems.length}
            </span>
          )}
         
        </button>

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          className="w-11 h-11 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20BD5A] rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 group relative"
          title="Chat on WhatsApp"
        >
          <FaWhatsapp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </button>
      </div>

      {/* Notification Panel */}
      {isNotificationOpen && (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-70 max-h-96 overflow-hidden animate-in slide-in-from-left-4 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-white" />
              <h3 className="text-white font-semibold">Latest News</h3>
            </div>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* News List */}
          <div className="p-4 space-y-3 overflow-y-auto max-h-72">
            {newsItems && newsItems.length > 0 ? (
              newsItems.map((news) => (
                <button
                  key={news.id}
                  onClick={() => handleNewsClick(news.slug)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start space-x-3">
                    {news.imageUrl && (
                      <div className="relative w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden">
                        <Image
                          src={news.imageUrl}
                          alt={news.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {news.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(news.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-6">
                <Newspaper className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No news available</p>
              </div>
            )}
          </div>

          {/* View All Button */}
          {newsItems && newsItems.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-3">
              <button
                onClick={handleViewAllNews}
                className="w-full text-center text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                View All News
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FloatingActions
