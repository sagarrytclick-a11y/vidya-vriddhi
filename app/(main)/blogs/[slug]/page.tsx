import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ShareButton } from '@/components/blog/ShareButton'
import { db } from '@/lib/db'
import { ArticleJsonLd } from '@/components/seo/json-ld'
import { stripForMeta } from '@/lib/seo'
import { SITE_IDENTITY } from '@/app/(main)/site-identity'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

type RelatedBlog = {
  id: string
  title: string
  slug: string
  content: string
  imageUrl: string | null
  createdAt: Date
}

export const revalidate = 3600

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)

const getReadingTime = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 200))} min read`
}

const getTopic = (title: string) => {
  if (/neet|exam|entrance/i.test(title)) return 'Exam preparation'
  if (/career|job|tech|mca|bca/i.test(title)) return 'Career guidance'
  if (/dorm|student|school|college life/i.test(title)) return 'Student life'
  if (/degree|credit|certificate|study/i.test(title)) return 'Admissions'
  return 'Education insights'
}

const toPlainText = (value: string) =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+\n/g, '\n')
    .trim()

const getParagraphs = (content: string) =>
  toPlainText(content)
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

function HeroImage({ src, title }: { src: string | null; title: string }) {
  if (!src) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center bg-gradient-to-br from-orange-500 to-orange-700">
        <div className="flex flex-col items-center gap-3 text-white/80">
          <BookOpen className="h-14 w-14" strokeWidth={1.4} />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">VidyaVriddhi journal</span>
        </div>
      </div>
    )
  }

  return <Image src={src} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 560px" />
}

function RelatedImage({ src, title }: { src: string | null; title: string }) {
  if (!src) {
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 text-orange-500">
        <BookOpen className="h-9 w-9" strokeWidth={1.5} />
      </div>
    )
  }

  return <Image src={src} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
}

function RelatedBlogCard({ blog }: { blog: RelatedBlog }) {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/60"
    >
      <div className="relative h-44 overflow-hidden">
        <RelatedImage src={blog.imageUrl} title={blog.title} />
        <div className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
          {getTopic(blog.title)}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-slate-500">{formatDate(blog.createdAt)}</p>
        <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-slate-950 transition-colors group-hover:text-orange-600">
          {blog.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{blog.content}</p>
        <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-bold text-orange-600">
          Read article <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await db.blog.findFirst({ where: { slug, active: true } })

  if (!blog) return { title: 'Blog Not Found' }

  const description =
    stripForMeta(blog.content, 160) ||
    'Read expert insights on education, college admissions, and career guidance.'
  const canonical = `/blogs/${slug}`
  const image = blog.imageUrl || `https://${SITE_IDENTITY.domain}/logo.png`

  return {
    title: blog.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: blog.title,
      description,
      type: 'article',
      publishedTime: blog.createdAt.toISOString(),
      modifiedTime: blog.updatedAt.toISOString(),
      images: [{ url: image, alt: blog.title }],
      url: `https://${SITE_IDENTITY.domain}${canonical}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description,
      images: [image],
    },
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params
  const blog = await db.blog.findFirst({
    where: {
      slug,
      active: true,
    },
  })

  if (!blog) {
    notFound()
  }

  const relatedBlogs = await db.blog.findMany({
    where: {
      active: true,
      id: { not: blog.id },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      imageUrl: true,
      createdAt: true,
    },
  })

  const paragraphs = getParagraphs(blog.content)
  const description = stripForMeta(blog.content, 220) || blog.title
  const readingTime = getReadingTime(toPlainText(blog.content))
  const topic = getTopic(blog.title)
  const articleUrl = `https://${SITE_IDENTITY.domain}/blogs/${blog.slug}`

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950">
      <ArticleJsonLd
        title={blog.title}
        description={description}
        url={`/blogs/${blog.slug}`}
        image={blog.imageUrl}
        datePublished={blog.createdAt.toISOString()}
        dateModified={blog.updatedAt.toISOString()}
        author={SITE_IDENTITY.meta.author}
      />

      {/* Article hero */}
      <header className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all articles
          </Link>
          <div className="mt-6">
            <Breadcrumbs
              dark
              items={[
                { label: 'Blogs', href: '/blogs' },
                { label: blog.title },
              ]}
            />
          </div>

          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-14">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.15em]">
                <span className="rounded-full bg-orange-500 px-3 py-1.5 text-white">Article</span>
                <span className="rounded-full border border-white/20 px-3 py-1.5 text-orange-200">{topic}</span>
              </div>
              <h1 className="max-w-3xl text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl">
                {blog.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">{description}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                    VV
                  </span>
                  <span>
                    <span className="block font-semibold text-white">VidyaVriddhi Editorial</span>
                    <span className="text-xs text-slate-400">Guidance for every learner</span>
                  </span>
                </div>
                <span className="hidden h-8 w-px bg-white/15 sm:block" />
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-300" />
                  {formatDate(blog.createdAt)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-300" />
                  {readingTime}
                </span>
              </div>
            </div>

            <div className="relative aspect-[4/3] min-h-[280px] overflow-hidden rounded-3xl border border-white/15 bg-slate-900 shadow-2xl shadow-black/30 lg:aspect-[5/4]">
              <HeroImage src={blog.imageUrl} title={blog.title} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 flex items-center gap-2 text-xs font-semibold text-white/85">
                <Sparkles className="h-4 w-4 text-orange-300" />
                Read. Think. Decide.
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Article body */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="min-w-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <BookOpen className="h-4 w-4" />
                </span>
                In this article
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {readingTime}
              </span>
            </div>

            <div className="space-y-6">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={`${blog.id}-paragraph-${index}`}
                  className={`whitespace-pre-wrap leading-8 text-slate-700 ${
                    index === 0 ? 'text-lg font-medium leading-9 text-slate-800' : 'text-base'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-orange-100 bg-orange-50 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="font-bold text-slate-950">Turn insight into your next step</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Have a question about your admissions or career path? Our counsellors can help you turn ideas into a practical plan.
                  </p>
                  <Link href="/contact" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-orange-700 hover:text-orange-800">
                    Talk to a counsellor <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <footer className="mt-10 flex flex-col gap-5 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">VV</span>
                <div>
                  <p className="text-sm font-bold text-slate-950">VidyaVriddhi Editorial</p>
                  <p className="mt-0.5 text-xs text-slate-500">Published {formatDate(blog.createdAt)}</p>
                </div>
              </div>
              <ShareButton title={blog.title} url={articleUrl} />
            </footer>
          </article>

          <aside>
            <div className="sticky top-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">Article details</p>
                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Published</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-900">{formatDate(blog.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Reading time</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-900">{readingTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Written by</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-900">VidyaVriddhi Editorial</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-5">
                <BookOpen className="h-6 w-6 text-orange-600" />
                <h2 className="mt-4 text-lg font-bold leading-snug text-slate-950">Keep exploring the journal</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Find more practical guides for your education and career journey.</p>
                <Link href="/blogs" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-orange-700 hover:text-orange-800">
                  Browse all articles <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related articles */}
      {relatedBlogs.length > 0 && (
        <section className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">More to explore</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Keep reading</h2>
              </div>
              <Link href="/blogs" className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700">
                View all articles <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedBlogs.map((relatedBlog) => <RelatedBlogCard key={relatedBlog.id} blog={relatedBlog} />)}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
