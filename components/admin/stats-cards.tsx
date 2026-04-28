'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Loader2
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
import { useRouter } from 'next/navigation'

interface StatCard {
  title: string
  value: number
  description: string
  icon: any
  color: string
  href: string
}

export function StatsCards() {
  const router = useRouter()
  const { colleges, isLoading: collegesLoading } = useColleges()
  const { countries, isLoading: countriesLoading } = useCountryContext()
  const { cities, isLoading: citiesLoading } = useCityContext()
  const { count: categoryCount, isLoading: categoriesLoading } = useCategoryCount()
  const { courses, isLoading: coursesLoading } = useAdminCourses()
  const { exams, isLoading: examsLoading } = useAdminExams()
  const { blogs, total: blogTotal, loading: blogsLoading } = useBlogContext()
  const { news, total: newsTotal, isLoading: newsLoading } = useAdminNews()
  const { stats, isLoading: enquiriesLoading } = useEnquiryStats()

  const statsData: StatCard[] = [
    {
      title: 'Total Countries',
      value: countries.length,
      description: 'Active destinations',
      icon: Globe,
      color: 'text-blue-400',
      href: '/admin/countries'
    },
    {
      title: 'Total Colleges',
      value: colleges.length,
      description: 'Educational institutions',
      icon: GraduationCap,
      color: 'text-green-400',
      href: '/admin/colleges'
    },
    {
      title: 'Total Exams',
      value: exams.length,
      description: 'Standardized tests',
      icon: FileText,
      color: 'text-purple-400',
      href: '/admin/exams'
    },
    {
      title: 'Blog Posts',
      value: blogTotal,
      description: 'Published content',
      icon: BookOpen,
      color: 'text-yellow-400',
      href: '/admin/blogs'
    },
    {
      title: 'Total Cities',
      value: cities.length,
      description: 'Study locations',
      icon: Building,
      color: 'text-orange-400',
      href: '/admin/cities'
    },
    {
      title: 'Categories',
      value: categoryCount,
      description: 'Content categories',
      icon: Folder,
      color: 'text-pink-400',
      href: '/admin/categories'
    },
    {
      title: 'Courses',
      value: courses.length,
      description: 'Available courses',
      icon: Library,
      color: 'text-cyan-400',
      href: '/admin/courses'
    },
    {
      title: 'News',
      value: newsTotal,
      description: 'Latest updates',
      icon: Newspaper,
      color: 'text-lime-400',
      href: '/admin/news'
    },
    {
      title: 'Total Enquiries',
      value: stats.total,
      description: 'Student inquiries',
      icon: MessageSquare,
      color: 'text-blue-400',
      href: '/admin/enquiries'
    },
    {
      title: 'Pending Enquiries',
      value: stats.pending,
      description: 'Awaiting response',
      icon: MessageSquare,
      color: 'text-red-400',
      href: '/admin/enquiries?status=PENDING'
    },
    {
      title: 'Resolved Enquiries',
      value: stats.resolved,
      description: 'Completed',
      icon: MessageSquare,
      color: 'text-green-400',
      href: '/admin/enquiries?status=RESOLVED'
    },
    {
      title: 'Follow Up Required',
      value: stats.followUp,
      description: 'Need attention',
      icon: MessageSquare,
      color: 'text-yellow-400',
      href: '/admin/enquiries?status=FOLLOW_UP'
    }
  ]

  const isLoading = collegesLoading || countriesLoading || citiesLoading || 
                   categoriesLoading || coursesLoading || examsLoading || 
                   blogsLoading || newsLoading || enquiriesLoading

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-8">
      {isLoading ? (
        <div className="col-span-full flex items-center justify-center min-h-32">
          <div className="flex items-center space-x-2 text-gray-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading statistics...</span>
          </div>
        </div>
      ) : (
        statsData.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card 
              key={index} 
              className="bg-slate-800 border-slate-700 text-white cursor-pointer hover:bg-slate-700 hover:border-slate-600 transition-all duration-200 hover:scale-105"
              onClick={() => router.push(stat.href)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-300 text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.description}</div>
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}
