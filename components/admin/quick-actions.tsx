'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, GraduationCap, FileText, BookOpen, Library, Newspaper, ChevronRight } from 'lucide-react'

const quickActions = [
  { label: 'Add Country', href: '/admin/countries', icon: Globe, color: 'text-blue-400' },
  { label: 'Add College', href: '/admin/colleges', icon: GraduationCap, color: 'text-green-400' },
  { label: 'Add Exam', href: '/admin/exams', icon: FileText, color: 'text-orange-400' },
  { label: 'Add Blog', href: '/admin/blogs', icon: BookOpen, color: 'text-purple-400' },
  { label: 'Add Course', href: '/admin/courses', icon: Library, color: 'text-cyan-400' },
  { label: 'Add News', href: '/admin/news', icon: Newspaper, color: 'text-pink-400' },
  { label: 'Add Category', href: '/admin/categories', icon: BookOpen, color: 'text-purple-400' },

]

export function QuickActions() {
  return (
    <Card className="bg-slate-800 border-slate-700 text-white m-3">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="outline"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:text-white flex flex-row items-center justify-between py-3 h-auto"
                asChild
              >
                <a href={action.href}>
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${action.color}`} />
                    <span className="text-sm">{action.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
