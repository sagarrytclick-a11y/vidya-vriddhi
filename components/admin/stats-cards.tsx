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

interface StatCard {
  title: string
  value: number
  description: string
  icon: any
  color: string
}

export function StatsCards() {
  const { colleges, isLoading: collegesLoading } = useColleges()
  const { countries, isLoading: countriesLoading } = useCountryContext()
  const { cities, isLoading: citiesLoading } = useCityContext()
  const { count: categoryCount, isLoading: categoriesLoading } = useCategoryCount()
  const { courses, isLoading: coursesLoading } = useAdminCourses()
  const { exams, isLoading: examsLoading } = useAdminExams()
  const { blogs, loading: blogsLoading } = useBlogContext()
  const { news, isLoading: newsLoading } = useAdminNews()

  const statsData: StatCard[] = [
    {
      title: 'Total Countries',
      value: countries.length,
      description: 'Active destinations',
      icon: Globe,
      color: 'text-blue-400'
    },
    {
      title: 'Total Colleges',
      value: colleges.length,
      description: 'Educational institutions',
      icon: GraduationCap,
      color: 'text-green-400'
    },
    {
      title: 'Total Exams',
      value: exams.length,
      description: 'Standardized tests',
      icon: FileText,
      color: 'text-purple-400'
    },
    {
      title: 'Blog Posts',
      value: blogs.length,
      description: 'Published content',
      icon: BookOpen,
      color: 'text-yellow-400'
    },
    {
      title: 'Total Cities',
      value: cities.length,
      description: 'Study locations',
      icon: Building,
      color: 'text-orange-400'
    },
    {
      title: 'Categories',
      value: categoryCount,
      description: 'Content categories',
      icon: Folder,
      color: 'text-pink-400'
    },
    {
      title: 'Courses',
      value: courses.length,
      description: 'Available courses',
      icon: Library,
      color: 'text-cyan-400'
    },
    {
      title: 'News',
      value: news.length,
      description: 'Latest updates',
      icon: Newspaper,
      color: 'text-lime-400'
    },
    {
      title: 'Pending Enquiries',
      value: 7, // This would come from an enquiries API when available
      description: 'Awaiting response',
      icon: MessageSquare,
      color: 'text-red-400'
    }
  ]

  const isLoading = collegesLoading || countriesLoading || citiesLoading || 
                   categoriesLoading || coursesLoading || examsLoading || 
                   blogsLoading || newsLoading

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
            <Card key={index} className="bg-slate-800 border-slate-700 text-white">
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
