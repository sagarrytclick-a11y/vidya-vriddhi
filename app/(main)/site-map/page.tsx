import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { unstable_cache } from 'next/cache'
import {
  Map,
  Home,
  GraduationCap,
  BookOpen,
  Building2,
  Globe,
  MapPin,
  FileText,
  Newspaper,
  Phone,
  Shield,
  ArrowRight,
} from 'lucide-react'
import { db } from '@/lib/db'
import { SITE_IDENTITY } from '@/app/(main)/site-identity'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Sitemap',
  description: `Browse all pages on ${SITE_IDENTITY.name} — colleges, courses, exams, cities, countries, blogs, news, and more.`,
  alternates: { canonical: '/site-map' },
}

export const revalidate = 3600

type SitemapLink = {
  href: string
  label: string
}

type SitemapSection = {
  title: string
  description: string
  icon: ReactNode
  links: SitemapLink[]
  viewAllHref?: string
}

async function getSitemapData() {
  return unstable_cache(
    async () => {
      const [colleges, exams, countries, cities, blogs, news, courses] = await Promise.all([
        db.college.findMany({
          where: { active: true },
          select: { name: true, slug: true },
          orderBy: { name: 'asc' },
        }),
        db.exam.findMany({
          where: { active: true },
          select: { name: true, slug: true },
          orderBy: { name: 'asc' },
        }),
        db.country.findMany({
          where: { active: true },
          select: { name: true, slug: true, flagEmoji: true },
          orderBy: { name: 'asc' },
        }),
        db.city.findMany({
          where: { active: true },
          select: { name: true, slug: true },
          orderBy: { name: 'asc' },
        }),
        db.blog.findMany({
          where: { active: true },
          select: { title: true, slug: true },
          orderBy: { createdAt: 'desc' },
        }),
        db.news.findMany({
          where: { active: true },
          select: { title: true, slug: true },
          orderBy: { createdAt: 'desc' },
        }),
        db.course.findMany({
          where: { active: true },
          select: { name: true, slug: true },
          orderBy: { name: 'asc' },
        }),
      ])

      return { colleges, exams, countries, cities, blogs, news, courses }
    },
    ['html-sitemap'],
    { revalidate: 3600 }
  )()
}

function SectionCard({ section }: { section: SitemapSection }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50/40 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm shadow-orange-500/25">
            {section.icon}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
            <p className="text-sm text-slate-600 mt-0.5">{section.description}</p>
          </div>
        </div>
        {section.viewAllHref && (
          <Link
            href={section.viewAllHref}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 shrink-0"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {section.links.length > 0 ? (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 p-4 sm:p-5">
          {section.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0 group-hover:scale-125 transition-transform" />
                <span className="truncate">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-5 py-6 text-sm text-slate-500">No pages listed yet.</p>
      )}

      {section.viewAllHref && (
        <div className="sm:hidden border-t border-slate-100 px-5 py-3">
          <Link
            href={section.viewAllHref}
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  )
}

export default async function SitemapPage() {
  const { colleges, exams, countries, cities, blogs, news, courses } = await getSitemapData()

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
      icon: <Home className="w-5 h-5" />,
      links: mainPages,
    },
    {
      title: 'Explore',
      description: 'Browse colleges, courses, exams and more',
      icon: <GraduationCap className="w-5 h-5" />,
      links: explorePages,
    },
    {
      title: 'Colleges',
      description: `${colleges.length} college pages`,
      icon: <Building2 className="w-5 h-5" />,
      links: colleges.map((c) => ({ href: `/colleges/${c.slug}`, label: c.name })),
      viewAllHref: '/colleges',
    },
    {
      title: 'Courses',
      description: `${courses.length} course pages`,
      icon: <BookOpen className="w-5 h-5" />,
      links: courses.map((c) => ({ href: `/colleges?course=${c.slug}`, label: c.name })),
      viewAllHref: '/courses',
    },
    {
      title: 'Exams',
      description: `${exams.length} exam pages`,
      icon: <FileText className="w-5 h-5" />,
      links: exams.map((e) => ({ href: `/exams/${e.slug}`, label: e.name })),
      viewAllHref: '/exams',
    },
    {
      title: 'Countries',
      description: `${countries.length} country pages`,
      icon: <Globe className="w-5 h-5" />,
      links: countries.map((c) => ({
        href: `/countries/${c.slug}`,
        label: `${c.flagEmoji ? `${c.flagEmoji} ` : ''}${c.name}`,
      })),
      viewAllHref: '/countries',
    },
    {
      title: 'Cities',
      description: `${cities.length} city pages`,
      icon: <MapPin className="w-5 h-5" />,
      links: cities.map((c) => ({ href: `/cities/${c.slug}`, label: c.name })),
      viewAllHref: '/cities',
    },
    {
      title: 'Blogs',
      description: `${blogs.length} blog posts`,
      icon: <BookOpen className="w-5 h-5" />,
      links: blogs.map((b) => ({ href: `/blogs/${b.slug}`, label: b.title })),
      viewAllHref: '/blogs',
    },
    {
      title: 'News',
      description: `${news.length} news articles`,
      icon: <Newspaper className="w-5 h-5" />,
      links: news.map((n) => ({ href: `/news/${n.slug}`, label: n.title })),
      viewAllHref: '/news',
    },
    {
      title: 'Company & Legal',
      description: 'Policies and company information',
      icon: <Shield className="w-5 h-5" />,
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
    colleges.length +
    courses.length +
    exams.length +
    countries.length +
    cities.length +
    blogs.length +
    news.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/25 to-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Breadcrumbs
            dark
            items={[{ label: 'Sitemap' }]}
          />
          <div className="mt-4 flex items-start gap-4">
            <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white shrink-0">
              <Map className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">Sitemap</h1>
              <p className="text-orange-100 text-lg max-w-2xl leading-relaxed">
                Find every page on {SITE_IDENTITY.name} — from colleges and exams to blogs, cities, and more.
              </p>
              <p className="mt-3 text-sm font-medium text-white/90">
                {totalLinks.toLocaleString()} pages listed
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Quick jump */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900 mb-3">Jump to section</p>
            <div className="flex flex-wrap gap-2">
              {sections.map((section) => (
                <a
                  key={section.title}
                  href={`#${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs sm:text-sm font-medium text-orange-700 hover:bg-orange-100 transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title} id={section.title.toLowerCase().replace(/\s+/g, '-')}>
              <SectionCard section={section} />
            </div>
          ))}

          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 sm:p-8 text-center">
            <Phone className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-2">Need help finding something?</h2>
            <p className="text-slate-300 mb-5 max-w-lg mx-auto">
              Our counselors can guide you to the right college, course, or exam page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/colleges"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 text-white hover:bg-white hover:text-slate-900 font-semibold px-5 py-2.5 transition-colors"
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
