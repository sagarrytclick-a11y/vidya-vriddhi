'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ArrowRight, Newspaper, BookOpen } from 'lucide-react'
import { usePublicBlogs } from '@/hooks/usePublicBlogs'
import { useNews } from '@/hooks/useNews'

export function TrendingInsights() {
  const { data: blogsData = { blogs: [] }, isLoading: blogsLoading } = usePublicBlogs(3)
  const blogs = blogsData?.blogs || []
  const { data: newsData, isLoading: newsLoading } = useNews(5)
  const news = newsData?.news || []

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getAuthorName = () => {
    return 'Vidya Vriddhi Team'
  }

  return (
    <section className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Trending Blogs */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-4xl font-bold text-slate-800">Trending Education Insights</h2>
            </div>

            <div className="space-y-6">
              {blogsLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                      <div className="w-24 h-20 bg-slate-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : blogs.length === 0 ? (
                <p className="text-slate-500">No blogs available</p>
              ) : (
                blogs.slice(0, 4).map((blog) => (
                  <article
                    key={blog.id}
                    className="flex gap-4 group cursor-pointer border-b border-black pb-6 last:border-0"
                  >
                    <div className="flex-1">
                      <Link href={`/blogs/${blog.slug}`} className="block">
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                          <span className="font-medium text-slate-600">{getAuthorName()}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(blog.createdAt)}
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="w-28 h-20 relative shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={blog.imageUrl || '/default-blog.png'}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </article>
                ))
              )}
            </div>

            {/* View More Blogs Button */}
            <Link
              href="/blogs"
              className="inline-flex items-center justify-center  w-full mt-6 px-6 py-3 border-2  rounded-lg text-white bg-blue-600 font-medium  hover:bg-blue-700 hover:text-white group"
            >
              View more blogs
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right Side - Popular News with Auto Scroll */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Newspaper className="w-5 h-5 text-slate-700" />
                <h2 className="text-lg font-bold text-slate-800">Popular News</h2>
              </div>

              <div className="overflow-hidden h-80 relative">
                {newsLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-16 h-16 bg-slate-200 rounded-lg shrink-0"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-slate-200 rounded w-full"></div>
                          <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : news.length === 0 ? (
                  <p className="text-slate-500 text-sm">No news available</p>
                ) : (
                  <div className="animate-scroll-down hover:paused">
                    {/* First set of news */}
                    <div className="space-y-4">
                      {news.map((item) => (
                        <article
                          key={`first-${item.id}`}
                          className="flex gap-3 group cursor-pointer"
                        >
                          <div className="w-16 h-16 relative shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            <Image
                              src={item.imageUrl || '/default-news.png'}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/news/${item.slug}`} className="block">
                              <h4 className="text-base font-bold text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {item.title}
                              </h4>
                              <span className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(item.createdAt)}
                              </span>
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                    {/* Duplicated set for infinite scroll */}
                    <div className="space-y-4 mt-4">
                      {news.map((item) => (
                        <article
                          key={`second-${item.id}`}
                          className="flex gap-3 group cursor-pointer"
                        >
                          <div className="w-16 h-16 relative shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            <Image
                              src={item.imageUrl || '/default-news.png'}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/news/${item.slug}`} className="block">
                              <h4 className="text-base font-bold text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {item.title}
                              </h4>
                              <span className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(item.createdAt)}
                              </span>
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* View All News Button */}
              <Link
                href="/news"
                className="inline-flex items-center justify-center w-full mt-6 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors group"
              >
                View All News & Updates
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
