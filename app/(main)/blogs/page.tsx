import Image from 'next/image'
import Link from 'next/link'
import type { Prisma } from '@prisma/client'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { db } from '@/lib/db'

export const revalidate = 300

interface BlogListPageProps {
  searchParams: Promise<{ page?: string; search?: string }>
}

type Blog = {
  id: string
  title: string
  slug: string
  content: string
  imageUrl: string | null
  createdAt: Date
}

const ITEMS_PER_PAGE = 6

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(value)

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

function BlogImage({
  src,
  alt,
  className = '',
  priority = false,
}: {
  src: string | null
  alt: string
  className?: string
  priority?: boolean
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-100 ${className}`}
      >
        <div className="flex flex-col items-center gap-2 text-orange-600/70">
          <BookOpen className="h-10 w-10" strokeWidth={1.5} />
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">Article preview</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`overflow-hidden bg-slate-100 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  )
}

function FeaturedBlog({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-100/70 lg:grid-cols-[1.08fr_0.92fr]"
    >
      <div className="relative min-h-[280px] overflow-hidden bg-slate-900 lg:min-h-[390px]">
        <BlogImage
          src={blog.imageUrl}
          alt={blog.title}
          priority
          className="absolute inset-0 h-full w-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
        <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-orange-700 shadow-lg backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          Featured read
        </div>
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
          <span className="text-sm font-medium text-white/80">A fresh perspective for your next step</span>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-orange-600 transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center p-7 sm:p-10">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-orange-600">
          <span>{getTopic(blog.title)}</span>
          <span className="text-slate-300">•</span>
          <span className="normal-case tracking-normal text-slate-500">{getReadingTime(blog.content)}</span>
        </div>
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl">
          {blog.title}
        </h2>
        <p className="mt-4 line-clamp-4 text-base leading-7 text-slate-600">{blog.content}</p>
        <div className="mt-7 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
          <span className="text-sm font-semibold text-slate-900">Read the full article</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/60"
    >
      <div className="relative h-52 overflow-hidden">
        <BlogImage src={blog.imageUrl} alt={blog.title} className="h-full w-full" />
        <div className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
          {getTopic(blog.title)}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-orange-500" />
            {formatDate(blog.createdAt)}
          </span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-orange-500" />
            {getReadingTime(blog.content)}
          </span>
        </div>
        <h3 className="line-clamp-2 text-xl font-bold leading-snug tracking-tight text-slate-950 transition-colors group-hover:text-orange-600">
          {blog.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{blog.content}</p>
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-slate-100 pt-5 text-sm font-bold text-orange-600">
          <span>Read article</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  )
}

function getPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage < 3) return [1, 2, 3, 4, totalPages]
  if (currentPage > totalPages - 2) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2]
}

export default async function BlogsPage({ searchParams }: BlogListPageProps) {
  const params = await searchParams
  const search = (params.search ?? '').trim()
  const currentPage = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1)
  const skip = (currentPage - 1) * ITEMS_PER_PAGE

  const where: Prisma.BlogWhereInput = { active: true }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ]
  }

  let blogs: Blog[] = []
  let total = 0
  let loadError = false

  try {
    const [items, count] = await Promise.all([
      db.blog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: ITEMS_PER_PAGE,
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          imageUrl: true,
          createdAt: true,
        },
      }),
      db.blog.count({ where }),
    ])
    blogs = items
    total = count
  } catch (error) {
    console.error('Error loading blogs:', error)
    loadError = true
  }

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))
  const clampedPage = Math.min(currentPage, totalPages)
  const featuredBlog = blogs[0]
  const gridBlogs = blogs.slice(1)
  const pageNumbers = getPageNumbers(clampedPage, totalPages)

  const pageHref = (page: number) => {
    const query = new URLSearchParams()
    if (search) query.set('search', search)
    if (page > 1) query.set('page', String(page))
    const qs = query.toString()
    return qs ? `/blogs?${qs}` : '/blogs'
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950">
      {/* Editorial hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-300">
              <BookOpen className="h-4 w-4" />
              The VidyaVriddhi journal
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Ideas for your next <span className="text-orange-400">big decision.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Clear, practical guidance for students, parents, and ambitious learners navigating admissions,
              careers, exams, and everything in between.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              {total > 0 ? `${total} ${total === 1 ? 'article' : 'articles'} to explore` : 'Fresh guidance, every week'}
            </span>
            <span className="hidden h-4 w-px bg-white/15 sm:block" />
            <span>Written for your next chapter</span>
          </div>
        </div>
      </section>

      {/* Search and results intro */}
      <section className="relative z-10 -mt-7 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">Find your next read</p>
              <h2 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">Explore all articles</h2>
            </div>
            <form action="/blogs" method="get" role="search" className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Search by title or topic..."
                aria-label="Search blog articles"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-11 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
              {search ? (
                <Link
                  href="/blogs"
                  aria-label="Clear blog search"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  type="submit"
                  aria-label="Submit blog search"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="blog-results" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-slate-600">
              {search
                ? `${total} ${total === 1 ? 'result' : 'results'} for “${search}”`
                : `${total} ${total === 1 ? 'article' : 'articles'} curated for you`}
            </p>
            {search && (
              <Link href="/blogs" className="w-fit text-sm font-semibold text-orange-600 transition hover:text-orange-700">
                Clear search
              </Link>
            )}
          </div>

          {loadError && (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <BookOpen className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-950">We couldn&apos;t load the articles</h2>
              <p className="mt-2 text-sm text-slate-600">Please refresh the page in a moment to try again.</p>
              <Link
                href="/blogs"
                className="mt-5 inline-block rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Try again
              </Link>
            </div>
          )}

          {!loadError && blogs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                <Search className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-950">No articles found</h2>
              <p className="mx-auto mt-2 max-w-md text-slate-600">
                {search
                  ? 'Try a different keyword or clear the search to browse every article.'
                  : 'New articles are on the way. Please check back soon.'}
              </p>
              {search && (
                <Link
                  href="/blogs"
                  className="mt-6 inline-block rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
                >
                  Browse all articles
                </Link>
              )}
            </div>
          )}

          {!loadError && featuredBlog && (
            <div className="space-y-8">
              <FeaturedBlog blog={featuredBlog} />
              {gridBlogs.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {gridBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
                </div>
              )}
            </div>
          )}

          {!loadError && totalPages > 1 && (
            <nav aria-label="Blog pagination" className="mt-12 flex items-center justify-center gap-2 border-t border-slate-200 pt-8">
              {clampedPage > 1 ? (
                <Link
                  href={pageHref(clampedPage - 1)}
                  aria-label="Previous page"
                  className="inline-flex h-10 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="inline-flex h-10 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-300 opacity-60"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </span>
              )}
              {pageNumbers.map((pageNumber) => (
                <Link
                  key={pageNumber}
                  href={pageHref(pageNumber)}
                  aria-current={clampedPage === pageNumber ? 'page' : undefined}
                  aria-label={`Page ${pageNumber}`}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition ${
                    clampedPage === pageNumber
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-200'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700'
                  }`}
                >
                  {pageNumber}
                </Link>
              ))}
              {clampedPage < totalPages ? (
                <Link
                  href={pageHref(clampedPage + 1)}
                  aria-label="Next page"
                  className="inline-flex h-10 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="inline-flex h-10 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-300 opacity-60"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </nav>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 to-orange-700 px-6 py-12 text-white shadow-xl shadow-orange-200 sm:px-10 sm:py-14 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[28px] border-white/10" />
          <div className="relative max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-100">Keep learning</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Need guidance for your next decision?</h2>
            <p className="mt-4 max-w-xl leading-7 text-orange-50/90">
              Our counsellors can help you turn the ideas you discover here into a clear, personalised plan.
            </p>
          </div>
          <div className="relative mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
            <Link href="/contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-orange-700 transition hover:bg-orange-50">
              Talk to an advisor
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/blogs" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/40 px-5 text-sm font-bold text-white transition hover:bg-white/10">
              Browse all articles
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}