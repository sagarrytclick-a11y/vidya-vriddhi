import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft, Calendar, Newspaper } from 'lucide-react'
import { db } from '@/lib/db'
import { ArticleJsonLd } from '@/components/seo/json-ld'
import { stripForMeta } from '@/lib/seo'
import { SITE_IDENTITY } from '@/app/(main)/site-identity'

interface NewsPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params
  const item = await db.news.findFirst({ where: { slug, active: true } })
  if (!item) return { title: 'News Not Found' }

  const description = stripForMeta(item.content) || 'Latest education news and updates from VidyaVriddhi.'
  return {
    title: item.title,
    description,
    alternates: { canonical: `/news/${slug}` },
    openGraph: {
      title: item.title,
      description,
      type: 'article',
      publishedTime: item.createdAt.toISOString(),
      modifiedTime: item.updatedAt.toISOString(),
      images: item.imageUrl ? [{ url: item.imageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description,
      images: item.imageUrl ? [item.imageUrl] : [],
    },
  }
}

export default async function NewsSlugPage({ params }: NewsPageProps) {
  const { slug } = await params

  const newsItem = await db.news.findFirst({
    where: { slug, active: true },
  })

  if (!newsItem) notFound()

  const relatedNews = await db.news.findMany({
    where: { active: true, id: { not: newsItem.id } },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      createdAt: true,
    },
  })

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const description = stripForMeta(newsItem.content) || newsItem.title

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleJsonLd
        title={newsItem.title}
        description={description}
        url={`/news/${newsItem.slug}`}
        image={newsItem.imageUrl}
        datePublished={newsItem.createdAt.toISOString()}
        dateModified={newsItem.updatedAt.toISOString()}
        author={SITE_IDENTITY.meta.author}
      />

      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to news
        </Link>

        <article className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {newsItem.imageUrl && (
            <div className="relative w-full h-72 sm:h-96">
              <Image
                src={newsItem.imageUrl}
                alt={newsItem.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1024px"
                priority
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
                  {item.imageUrl ? (
                    <div className="relative w-full h-40 overflow-hidden rounded-lg mb-4">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 rounded-lg mb-4 bg-gray-100 flex items-center justify-center">
                      <Newspaper className="w-10 h-10 text-gray-300" />
                    </div>
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
