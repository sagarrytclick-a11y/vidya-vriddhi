'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Calendar, Clock, User, ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useBlogs } from '@/hooks/useBlogs'

export default function BlogsPage() {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5
  const { blogs, total, isLoading, error } = useBlogs(itemsPerPage, currentPage * itemsPerPage)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBlogs = blogs?.filter(blog => {
    const matchesSearch = searchTerm === '' ||
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  }) || []

  const totalPages = Math.ceil(total / itemsPerPage)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Error Loading Blogs</h2>
          <p className="text-slate-600">Failed to load blogs. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore <span className="text-orange-100">Blogs</span> 2026
            </h1>
            <p className="text-xl text-orange-100/90 max-w-3xl mx-auto leading-relaxed">
              Discover insights, tips, and stories from our expert contributors
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search blogs by title or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3"></div>
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Blogs List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Blog Image */}
                    {blog.imageUrl && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}

                    {/* Blog Meta */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-2">
                          {blog.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-slate-500">•</span>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Blog Excerpt */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {blog.content}
                    </p>

                    {/* Blog Actions */}
                    <div className="flex gap-3">
                      <Link href={`/blogs/${blog.slug}`}>
                        <Button variant="outline" className="flex-1 border-slate-300 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 transition-all">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {!isLoading && filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No blogs found</h3>
                <p className="text-slate-600">
                  Try adjusting your search or category filters to find what you're looking for.
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-center mt-12 pt-8 border-t border-slate-200">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i
                  } else if (currentPage < 3) {
                    pageNum = i
                  } else if (currentPage > totalPages - 3) {
                    pageNum = totalPages - 5 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={currentPage === pageNum 
                        ? "bg-orange-500 hover:bg-orange-600 text-white" 
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                      }
                    >
                      {pageNum + 1}
                    </Button>
                  )
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated with Latest Insights
          </h2>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Get expert tips, educational content, and industry insights delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold">
              Subscribe to Newsletter
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
              Browse All Categories
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
