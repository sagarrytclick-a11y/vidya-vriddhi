'use client'

import React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Newspaper } from 'lucide-react'
import { useNews } from '@/hooks/useNews'

export default function NewsSlugPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const { data, isLoading, error } = useNews(100, 0)

  const newsItem = data?.data.find((item) => item.slug === slug) || null
  const relatedNews = data?.data.filter((item) => item.id !== newsItem?.id).slice(0, 3) || []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-12 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse" />
          <div className="h-96 w-full bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (error || !newsItem) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm">
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">News not found</h2>
            <p className="text-gray-600 mb-6">The article you are looking for does not exist or may have been removed.</p>
            <button
              onClick={() => router.push('/news')}
              className="inline-flex items-center justify-center px-5 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Back to news
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <article className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {newsItem.imageUrl && (
            <div className="relative w-full h-72 sm:h-96">
              <img
                src={newsItem.imageUrl}
                alt={newsItem.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(newsItem.createdAt)}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              {newsItem.title}
            </h1>

            <div className="mt-8 prose prose-slate max-w-none">
              <p className="text-gray-700 leading-8 whitespace-pre-line text-base sm:text-lg">
                {newsItem.content}
              </p>
            </div>
          </div>
        </article>

        {relatedNews.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">More news</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  <p className="text-sm text-gray-500 mb-2">{formatDate(item.createdAt)}</p>
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
