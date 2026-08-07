'use client'

import {
  Globe,
  GraduationCap,
  FileText,
  BookOpen,
  Library,
  Newspaper,
  ChevronRight,
  Folder,
} from 'lucide-react'

const quickActions = [
  { label: 'Add Country', href: '/admin/countries', icon: Globe, accent: 'text-[#ea580c]' },
  { label: 'Add College', href: '/admin/colleges', icon: GraduationCap, accent: 'text-[#ea580c]' },
  { label: 'Add Exam', href: '/admin/exams', icon: FileText, accent: 'text-[#f59e0b]' },
  { label: 'Add Blog', href: '/admin/blogs', icon: BookOpen, accent: 'text-[#fbbf24]' },
  { label: 'Add Course', href: '/admin/courses', icon: Library, accent: 'text-[#f97316]' },
  { label: 'Add News', href: '/admin/news', icon: Newspaper, accent: 'text-[#fb923c]' },
  { label: 'Add Category', href: '/admin/categories', icon: Folder, accent: 'text-[#f59e0b]' },
]

export function QuickActions() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-[#12161e] ring-1 ring-white/[0.05]">
      <div className="border-b border-white/[0.04] px-5 py-4">
        <h2 className="text-base font-semibold text-white">Quick Actions</h2>
        <p className="text-xs text-[#6b7280]">Jump into common tasks</p>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-3">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <a
              key={action.href + action.label}
              href={action.href}
              className="group flex items-center justify-between rounded-xl bg-[#0c0f14]/60 px-3 py-3 ring-1 ring-transparent transition-all hover:bg-[#0c0f14] hover:ring-white/[0.06]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#151a22] ring-1 ring-white/[0.04]">
                  <Icon className={`h-4 w-4 ${action.accent}`} />
                </div>
                <span className="text-sm font-medium text-[#d1d5db] group-hover:text-white">
                  {action.label}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-[#4b5563] transition-transform group-hover:translate-x-0.5 group-hover:text-[#9ca3af]" />
            </a>
          )
        })}
      </div>
    </div>
  )
}
