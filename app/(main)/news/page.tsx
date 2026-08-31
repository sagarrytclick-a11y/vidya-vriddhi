import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Calendar, ArrowLeft, Newspaper, ChevronLeft, ChevronRight } from 'lucide-react'
import { db } from '@/lib/db'

export const revalidate = 3600

interface NewsListPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function NewsPage({ searchParams }: NewsListPageProps) {
  const { page: pageStr } = await searchParams
  const currentPage = Math.max(1, Number.parseInt(pageStr || '1', 10) || 1)
  const itemsPerPage = 10
  const skip = (currentPage - 1) * itemsPerPage

  const [newsItems, total] = await Promise.all([
    db.news.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: itemsPerPage,
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        imageUrl: true,
        createdAt: true,
      },
    }),
    db.news.count({ where: { active: true } }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage))

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-orange-100 hover:text-white text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-3">
            <Newspaper className="w-8 h-8" />
            <h1 className="text-3xl sm:text-4xl font-bold">Education News</h1>
          </div>
          <p className="mt-3 text-orange-100 max-w-2xl">
            Latest updates on colleges, exams, admissions, and study abroad.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {newsItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <Newspaper className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">No news yet</h2>
            <p className="text-gray-600 mt-2">Check back soon for education updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsItems.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {item.imageUrl ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-orange-50 flex items-center justify-center">
                    <Newspaper className="w-12 h-12 text-orange-300" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 line-clamp-2">{item.title}</h2>
                  <p className="mt-2 text-gray-600 line-clamp-3">{item.content}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-3" aria-label="News pagination">
            {currentPage > 1 ? (
              <Link
                href={currentPage === 2 ? '/news' : `/news?page=${currentPage - 1}`}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-100 text-gray-300">
                <ChevronLeft className="w-4 h-4" />
                Previous
              </span>
            )}
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages ? (
              <Link
                href={`/news?page=${currentPage + 1}`}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-100 text-gray-300">
                Next
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </nav>
        )}
      </div>
    </div>
  )
}
