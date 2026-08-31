import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { db } from '@/lib/db'
import { ArticleJsonLd } from '@/components/seo/json-ld'
import { stripForMeta } from '@/lib/seo'
import { SITE_IDENTITY } from '@/app/(main)/site-identity'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await db.blog.findFirst({ where: { slug, active: true } })
  if (!blog) return { title: 'Blog Not Found' }

  const description =
    stripForMeta(blog.content) ||
    'Read expert insights on education, college admissions, and career guidance.'

  return {
    title: blog.title,
    description,
    alternates: { canonical: `/blogs/${slug}` },
    openGraph: {
      title: blog.title,
      description,
      type: 'article',
      publishedTime: blog.createdAt.toISOString(),
      modifiedTime: blog.updatedAt.toISOString(),
      images: blog.imageUrl ? [{ url: blog.imageUrl }] : [],
      url: `/blogs/${slug}`,
    },
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params
  
  const blog = await db.blog.findFirst({
    where: {
      slug,
      active: true
    }
  })

  if (!blog) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-white">
      <ArticleJsonLd
        title={blog.title}
        description={stripForMeta(blog.content) || blog.title}
        url={`/blogs/${blog.slug}`}
        image={blog.imageUrl}
        datePublished={blog.createdAt.toISOString()}
        dateModified={blog.updatedAt.toISOString()}
        author={SITE_IDENTITY.meta.author}
      />
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/blogs">
            <Button variant="ghost" className="text-white hover:bg-orange-400/20 mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
          <Breadcrumbs dark items={[
            { label: 'Blogs', href: '/blogs' },
            { label: blog.title },
          ]} />
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
      </header>

      {/* Blog Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-slate-200">
            <CardContent className="p-8">
              {/* Blog Image */}
              {blog.imageUrl && (
                <div className="mb-8 rounded-xl overflow-hidden relative" style={{ aspectRatio: '16/9' }}>
                  <Image 
                    src={blog.imageUrl} 
                    alt={blog.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 1024px"
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
    </main>
  )
}
