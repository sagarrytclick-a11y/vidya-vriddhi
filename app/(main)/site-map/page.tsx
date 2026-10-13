import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { unstable_cache } from 'next/cache'
import {
  ArrowRight,
  BookOpen,
  Building2,
  FileText,
  Globe,
  GraduationCap,
  Home,
  Map,
  MapPin,
  Newspaper,
  Phone,
  Shield,
} from 'lucide-react'
import { db } from '@/lib/db'
import { SITE_IDENTITY } from '@/app/(main)/site-identity'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { SitemapInfiniteLinks } from '@/components/sitemap/SitemapInfiniteLinks'

export const metadata: Metadata = {
  title: 'Sitemap',
  description: `Browse all pages on ${SITE_IDENTITY.name} — colleges, courses, exams, cities, countries, blogs, news, and more.`,
  alternates: { canonical: '/site-map' },
}

export const revalidate = 3600

const INITIAL_LINKS = 24

type SitemapLink = {
  href: string
  label: string
}

type InfiniteType = 'colleges' | 'courses' | 'exams' | 'cities' | 'blogs' | 'news'

type SitemapSection = {
  title: string
  description: string
  icon: ReactNode
  links: SitemapLink[]
  viewAllHref?: string
  infiniteType?: InfiniteType
  total?: number
}

async function getSitemapData() {
  return unstable_cache(
    async () => {
      const where = { active: true }
      const [
        colleges,
        collegeTotal,
        exams,
        examTotal,
        countries,
        cities,
        cityTotal,
        blogs,
        blogTotal,
        news,
        newsTotal,
        courses,
        courseTotal,
      ] = await Promise.all([
        db.college.findMany({
          where,
          select: { name: true, slug: true },
          orderBy: { name: 'asc' },
          take: INITIAL_LINKS,
        }),
        db.college.count({ where }),
        db.exam.findMany({
          where,
          select: { name: true, slug: true },
          orderBy: { name: 'asc' },
          take: INITIAL_LINKS,
        }),
        db.exam.count({ where }),
        db.country.findMany({
          where,
          select: { name: true, slug: true, flagEmoji: true },
          orderBy: { name: 'asc' },
        }),
        db.city.findMany({
          where,
          select: { name: true, slug: true },
          orderBy: { name: 'asc' },
          take: INITIAL_LINKS,
        }),
        db.city.count({ where }),
        db.blog.findMany({
          where,
          select: { title: true, slug: true },
          orderBy: { createdAt: 'desc' },
          take: INITIAL_LINKS,
        }),
        db.blog.count({ where }),
        db.news.findMany({
          where,
          select: { title: true, slug: true },
          orderBy: { createdAt: 'desc' },
          take: INITIAL_LINKS,
        }),
        db.news.count({ where }),
        db.course.findMany({
          where,
          select: { name: true, slug: true },
          orderBy: { name: 'asc' },
          take: INITIAL_LINKS,
        }),
        db.course.count({ where }),
      ])

      return {
        colleges,
        collegeTotal,
        exams,
        examTotal,
        countries,
        cities,
        cityTotal,
        blogs,
        blogTotal,
        news,
        newsTotal,
        courses,
        courseTotal,
      }
    },
    ['html-sitemap-v2'],
    { revalidate: 3600 }
  )()
}

function SectionCard({ section }: { section: SitemapSection }) {
  const useInfinite =
    Boolean(section.infiniteType) && (section.total ?? 0) > (section.links.length || 0)
  const linkCount = section.total ?? section.links.length

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_8px_28px_-20px_rgba(15,23,42,0.35)]">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 ring-1 ring-orange-100">
            {section.icon}
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">{section.title}</h2>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500 sm:text-sm">
              {section.description}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold tabular-nums text-slate-600">
            {linkCount.toLocaleString()}
          </span>
          {section.viewAllHref && (
            <Link
              href={section.viewAllHref}
              className="hidden items-center gap-1 text-xs font-semibold text-orange-600 transition-colors hover:text-orange-700 sm:inline-flex"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {section.links.length > 0 ? (
        useInfinite && section.infiniteType ? (
          <SitemapInfiniteLinks
            type={section.infiniteType}
            initialLinks={section.links}
            total={section.total || section.links.length}
            pageSize={INITIAL_LINKS}
          />
        ) : (
          <ul className="grid gap-x-2 gap-y-1 p-3 sm:grid-cols-2 sm:p-4">
            {section.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex min-h-10 items-center gap-2 rounded-md px-2.5 py-2 text-sm leading-snug text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-700"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400 transition-transform group-hover:scale-125" />
                  <span className="min-w-0">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )
      ) : (
        <p className="px-5 py-6 text-sm text-slate-500">No pages listed yet.</p>
      )}

      {section.viewAllHref && (
        <div className="border-t border-slate-100 px-4 py-3 sm:hidden">
          <Link
            href={section.viewAllHref}
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  )
}

export default async function SitemapPage() {
  const {
    colleges,
    collegeTotal,
    exams,
    examTotal,
    countries,
    cities,
    cityTotal,
    blogs,
    blogTotal,
    news,
    newsTotal,
    courses,
    courseTotal,
  } = await getSitemapData()

  const mainPages: SitemapLink[] = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/career', label: 'Career' },
    { href: '/compare-colleges', label: 'Compare Colleges' },
    { href: '/neet-rank-predictor', label: 'NEET Rank Predictor' },
    { href: '/online-mba', label: 'Online MBA' },
    { href: '/btech', label: 'B.Tech' },
    { href: '/study-abroad', label: 'Study Abroad' },
    { href: '/mbbs-in-russia', label: 'MBBS in Russia' },
    { href: '/mbbs-in-georgia', label: 'MBBS in Georgia' },
    { href: '/mbbs-in-kyrgyzstan', label: 'MBBS in Kyrgyzstan' },
  ]

  const explorePages: SitemapLink[] = [
    { href: '/colleges', label: 'All Colleges' },
    { href: '/courses', label: 'All Courses' },
    { href: '/exams', label: 'All Exams' },
    { href: '/countries', label: 'All Countries' },
    { href: '/cities', label: 'All Cities' },
    { href: '/blogs', label: 'All Blogs' },
    { href: '/news', label: 'All News' },
  ]

  const legalPages: SitemapLink[] = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms & Conditions' },
    { href: '/site-map', label: 'Sitemap' },
  ]

  const sections: SitemapSection[] = [
    {
      title: 'Main Pages',
      description: 'Core pages of the website',
      icon: <Home className="h-5 w-5" />,
      links: mainPages,
    },
    {
      title: 'Explore',
      description: 'Browse colleges, courses, exams and more',
      icon: <GraduationCap className="h-5 w-5" />,
      links: explorePages,
    },
    {
      title: 'Colleges',
      description: `${collegeTotal} college pages — scroll inside to load more`,
      icon: <Building2 className="h-5 w-5" />,
      links: colleges.map((college) => ({ href: `/colleges/${college.slug}`, label: college.name })),
      viewAllHref: '/colleges',
      infiniteType: 'colleges',
      total: collegeTotal,
    },
    {
      title: 'Courses',
      description: `${courseTotal} course pages — scroll inside to load more`,
      icon: <BookOpen className="h-5 w-5" />,
      links: courses.map((course) => ({ href: `/courses/${course.slug}`, label: course.name })),
      viewAllHref: '/courses',
      infiniteType: 'courses',
      total: courseTotal,
    },
    {
      title: 'Exams',
      description: `${examTotal} exam pages — scroll inside to load more`,
      icon: <FileText className="h-5 w-5" />,
      links: exams.map((exam) => ({ href: `/exams/${exam.slug}`, label: exam.name })),
      viewAllHref: '/exams',
      infiniteType: 'exams',
      total: examTotal,
    },
    {
      title: 'Countries',
      description: `${countries.length} country pages`,
      icon: <Globe className="h-5 w-5" />,
      links: countries.map((country) => ({
        href: `/countries/${country.slug}`,
        label: `${country.flagEmoji ? `${country.flagEmoji} ` : ''}${country.name}`,
      })),
      viewAllHref: '/countries',
    },
    {
      title: 'Cities',
      description: `${cityTotal} city pages — scroll inside to load more`,
      icon: <MapPin className="h-5 w-5" />,
      links: cities.map((city) => ({ href: `/cities/${city.slug}`, label: city.name })),
      viewAllHref: '/cities',
      infiniteType: 'cities',
      total: cityTotal,
    },
    {
      title: 'Blogs',
      description: `${blogTotal} blog posts — scroll inside to load more`,
      icon: <BookOpen className="h-5 w-5" />,
      links: blogs.map((blog) => ({ href: `/blogs/${blog.slug}`, label: blog.title })),
      viewAllHref: '/blogs',
      infiniteType: 'blogs',
      total: blogTotal,
    },
    {
      title: 'News',
      description: `${newsTotal} news articles — scroll inside to load more`,
      icon: <Newspaper className="h-5 w-5" />,
      links: news.map((article) => ({ href: `/news/${article.slug}`, label: article.title })),
      viewAllHref: '/news',
      infiniteType: 'news',
      total: newsTotal,
    },
    {
      title: 'Company & Legal',
      description: 'Policies and company information',
      icon: <Shield className="h-5 w-5" />,
      links: [
        ...legalPages,
        { href: '/about', label: 'About Us' },
        { href: '/career', label: 'Careers' },
        { href: '/contact', label: 'Contact' },
      ],
    },
  ]

  const totalLinks =
    mainPages.length +
    explorePages.length +
    legalPages.length +
    collegeTotal +
    courseTotal +
    examTotal +
    countries.length +
    cityTotal +
    blogTotal +
    newsTotal

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      <section className="relative overflow-hidden border-b border-[#21433b] bg-[#15352f] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute inset-y-0 right-0 w-1/3 border-l border-white/10 bg-[#1b4038]/45" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <Breadcrumbs dark items={[{ label: 'Sitemap' }]} />
          <div className="mt-7 grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-orange-300">
                <Map className="h-4 w-4" />
                <span>Explore the website</span>
              </div>
              <h1 className="text-4xl font-bold text-white sm:text-5xl">Sitemap</h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#d4e2dc] sm:text-lg">
                Every destination in one place, from colleges and courses to the latest news.
              </p>
            </div>
            <div className="flex items-center gap-8 border-t border-white/15 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <div>
                <p className="text-3xl font-bold tabular-nums text-white sm:text-4xl">
                  {totalLinks.toLocaleString()}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#b6cdc4]">
                  Pages listed
                </p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <p className="text-3xl font-bold tabular-nums text-orange-300 sm:text-4xl">
                  {sections.length}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#b6cdc4]">
                  Categories
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav
            aria-label="Jump to sitemap section"
            className="sticky top-20 z-20 mb-6 border-y border-slate-200 bg-[#f6f8f6]/95 py-3 backdrop-blur lg:top-[7.5rem]"
          >
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Jump to section
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {sections.map((section) => (
                <a
                  key={section.title}
                  href={`#${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="shrink-0 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-orange-300 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </nav>

          <div className="grid items-start gap-4 lg:grid-cols-2 lg:gap-5">
            {sections.map((section) => (
              <div
                key={section.title}
                id={section.title.toLowerCase().replace(/\s+/g, '-')}
                className="scroll-mt-40"
              >
                <SectionCard section={section} />
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-5 rounded-xl bg-[#15352f] p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/10 text-orange-300">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Need help finding something?</h2>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#c6d8d1]">
                  Our counselors can guide you to the right college, course, or exam page.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-10 items-center justify-center rounded-md bg-orange-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
              >
                Contact Us
              </Link>
              <Link
                href="/colleges"
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/25 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Browse Colleges
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
