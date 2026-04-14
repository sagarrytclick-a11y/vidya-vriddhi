import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/db'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params
  
  const blog = await db.blog.findUnique({
    where: {
      slug,
      active: true
    }
  })

  if (!blog) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/blogs">
            <Button variant="ghost" className="text-white hover:bg-orange-400/20 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                Blog
              </Badge>
              <div className="flex items-center gap-1 text-orange-100/90 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {blog.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-slate-200">
            <CardContent className="p-8">
              {/* Blog Image */}
              {blog.imageUrl && (
                <div className="mb-8 rounded-xl overflow-hidden">
                  <img 
                    src={blog.imageUrl} 
                    alt={blog.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Blog Content */}
              <div className="prose prose-lg max-w-none">
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {blog.content}
                </div>
              </div>

              {/* Blog Meta */}
              <div className="mt-8 pt-8 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>Last updated: {new Date(blog.updatedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Content */}
          <div className="mt-12">
            <Link href="/blogs">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Browse All Blogs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
