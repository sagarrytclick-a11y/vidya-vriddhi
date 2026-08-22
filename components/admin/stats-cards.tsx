'use client'

import { AdminStatsSkeleton } from '@/components/admin/page-ui'
import {
  Globe,
  GraduationCap,
  FileText,
  BookOpen,
  Building,
  Folder,
  MessageSquare,
  Library,
  Newspaper,
  Laptop,
  TrendingDown,
  TrendingUp,
  Minus,
} from 'lucide-react'
import { useColleges } from '@/hooks/useColleges'
import { useCountryContext } from '@/contexts/country-context'
import { useCityContext } from '@/contexts/city-context'
import { useCategoryCount } from '@/hooks/useCategories'
import { useAdminCourses } from '@/hooks/useAdminCourses'
import { useAdminExams } from '@/hooks/useAdminExams'
import { useBlogContext } from '@/contexts/blog-context'
import { useAdminNews } from '@/hooks/useAdminNews'
import { useEnquiryStats } from '@/hooks/useEnquiries'
import { useServiceLeadStats } from '@/hooks/useServiceLeads'
import { useRouter } from 'next/navigation'

interface StatCard {
  title: string
  value: number
  description: string
  icon: React.ComponentType<{ className?: string }>
  accent: string
  href: string
  trend?: 'up' | 'down' | 'flat'
}

const accentMap: Record<string, { icon: string; glow: string; bar: string }> = {
  orange: { icon: 'text-[#ea580c]', glow: 'from-[#ea580c]/10', bar: 'bg-[#ea580c]' },
  amber: { icon: 'text-[#f59e0b]', glow: 'from-[#f59e0b]/10', bar: 'bg-[#f59e0b]' },
  coral: { icon: 'text-[#fb923c]', glow: 'from-[#fb923c]/10', bar: 'bg-[#fb923c]' },
  rose: { icon: 'text-[#e11d48]', glow: 'from-[#e11d48]/10', bar: 'bg-[#e11d48]' },
  stone: { icon: 'text-[#a8a29e]', glow: 'from-[#a8a29e]/10', bar: 'bg-[#a8a29e]' },
  emerald: { icon: 'text-[#059669]', glow: 'from-[#059669]/10', bar: 'bg-[#059669]' },
}

export function StatsCards() {
  const router = useRouter()
  const { colleges, pagination: collegePagination, isLoading: collegesLoading } = useColleges()
  const { countries, isLoading: countriesLoading } = useCountryContext()
  const { cities, pagination: cityPagination, isLoading: citiesLoading } = useCityContext()
  const { count: categoryCount, isLoading: categoriesLoading } = useCategoryCount()
  const { courses, pagination, isLoading: coursesLoading } = useAdminCourses()
  const { exams, isLoading: examsLoading } = useAdminExams()
  const { total: blogTotal, loading: blogsLoading } = useBlogContext()
  const { total: newsTotal, isLoading: newsLoading } = useAdminNews()
  const { stats, isLoading: enquiriesLoading } = useEnquiryStats()
  const { stats: serviceStats, isLoading: serviceLeadsLoading } = useServiceLeadStats()

  const statsData: StatCard[] = [
    {
      title: 'Countries',
      value: countries.length,
      description: 'Active destinations',
      icon: Globe,
      accent: 'coral',
      href: '/admin/countries',
      trend: 'up',
    },
    {
      title: 'Colleges',
      value: collegePagination?.total || colleges.length,
      description: 'Institutions',
      icon: GraduationCap,
      accent: 'orange',
      href: '/admin/colleges',
      trend: 'up',
    },
    {
      title: 'Exams',
      value: exams.length,
      description: 'Standardized tests',
      icon: FileText,
      accent: 'amber',
      href: '/admin/exams',
      trend: 'flat',
    },
    {
      title: 'Blog Posts',
      value: blogTotal,
      description: 'Published content',
      icon: BookOpen,
      accent: 'amber',
      href: '/admin/blogs',
      trend: 'up',
    },
    {
      title: 'Cities',
      value: cityPagination?.total || cities.length,
      description: 'Study locations',
      icon: Building,
      accent: 'orange',
      href: '/admin/cities',
      trend: 'up',
    },
    {
      title: 'Categories',
      value: categoryCount,
      description: 'Content groups',
      icon: Folder,
      accent: 'amber',
      href: '/admin/categories',
      trend: 'flat',
    },
    {
      title: 'Courses',
      value: pagination?.total || courses.length,
      description: 'Programs',
      icon: Library,
      accent: 'stone',
      href: '/admin/courses',
      trend: 'up',
    },
    {
      title: 'News',
      value: newsTotal,
      description: 'Latest updates',
      icon: Newspaper,
      accent: 'orange',
      href: '/admin/news',
      trend: 'up',
    },
    {
      title: 'Enquiries',
      value: stats.total,
      description: 'All inquiries',
      icon: MessageSquare,
      accent: 'coral',
      href: '/admin/enquiries',
      trend: 'up',
    },
    {
      title: 'Pending',
      value: stats.pending,
      description: 'Awaiting response',
      icon: MessageSquare,
      accent: 'rose',
      href: '/admin/enquiries?status=PENDING',
      trend: 'down',
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      description: 'Completed',
      icon: MessageSquare,
      accent: 'emerald',
      href: '/admin/enquiries?status=RESOLVED',
      trend: 'up',
    },
    {
      title: 'Follow Up',
      value: stats.followUp,
      description: 'Need attention',
      icon: MessageSquare,
      accent: 'amber',
      href: '/admin/enquiries?status=FOLLOW_UP',
      trend: 'flat',
    },
    {
      title: 'Service Leads',
      value: serviceStats.total,
      description: 'Website / marketing',
      icon: Laptop,
      accent: 'coral',
      href: '/admin/service-leads',
      trend: 'up',
    },
    {
      title: 'Svc Pending',
      value: serviceStats.pending,
      description: 'Service awaiting',
      icon: Laptop,
      accent: 'rose',
      href: '/admin/service-leads?status=PENDING',
      trend: 'down',
    },
    {
      title: 'Svc Resolved',
      value: serviceStats.resolved,
      description: 'Service completed',
      icon: Laptop,
      accent: 'emerald',
      href: '/admin/service-leads?status=RESOLVED',
      trend: 'up',
    },
    {
      title: 'Svc Follow Up',
      value: serviceStats.followUp,
      description: 'Service follow-up',
      icon: Laptop,
      accent: 'amber',
      href: '/admin/service-leads?status=FOLLOW_UP',
      trend: 'flat',
    },
  ]

  const isLoading =
    collegesLoading ||
    countriesLoading ||
    citiesLoading ||
    categoriesLoading ||
    coursesLoading ||
    examsLoading ||
    blogsLoading ||
    newsLoading ||
    enquiriesLoading ||
    serviceLeadsLoading

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {isLoading ? (
        <div className="col-span-full">
          <AdminStatsSkeleton count={8} />
        </div>
      ) : (
        statsData.map((stat) => {
          const Icon = stat.icon
          const colors = accentMap[stat.accent]
          const TrendIcon =
            stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : Minus
          const trendColor =
            stat.trend === 'up'
              ? 'text-[#34d399]'
              : stat.trend === 'down'
                ? 'text-[#fb7185]'
                : 'text-[#6b7280]'

          return (
            <button
              key={stat.title}
              type="button"
              onClick={() => router.push(stat.href)}
              className={`group relative overflow-hidden rounded-2xl bg-[#12161e] p-4 text-left ring-1 ring-white/[0.05] transition-all duration-300 hover:-translate-y-0.5 hover:ring-white/[0.1] hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.8)]`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${colors.glow} via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#6b7280]">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-white tabular-nums">
                    {stat.value}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0c0f14] ring-1 ring-white/[0.05]">
                  <Icon className={`h-5 w-5 ${colors.icon}`} />
                </div>
              </div>
              <div className="relative mt-4 flex items-center justify-between">
                <p className="text-xs text-[#6b7280]">{stat.description}</p>
                <TrendIcon className={`h-3.5 w-3.5 ${trendColor}`} />
              </div>
              <div className={`absolute bottom-0 left-0 h-[2px] w-full opacity-40 ${colors.bar}`} />
            </button>
          )
        })
      )}
    </div>
  )
}
