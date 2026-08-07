'use client'

import { GraduationCap, FileText, MessageSquare, BookOpen, Globe, Library, Newspaper } from 'lucide-react'

const recentActivities = [
  {
    action: 'New college added',
    item: 'MIT - Massachusetts Institute of Technology',
    time: '2 hours ago',
    type: 'college',
  },
  {
    action: 'Exam updated',
    item: 'JEE Main 2024 dates announced',
    time: '4 hours ago',
    type: 'exam',
  },
  {
    action: 'New enquiry received',
    item: 'John Doe - Engineering admission query',
    time: '6 hours ago',
    type: 'enquiry',
  },
  {
    action: 'Blog post published',
    item: 'Top 10 Engineering Colleges in 2024',
    time: '8 hours ago',
    type: 'blog',
  },
  {
    action: 'Country added',
    item: 'United Kingdom - Study destinations',
    time: '1 day ago',
    type: 'country',
  },
  {
    action: 'New course added',
    item: 'Computer Science Engineering',
    time: '2 days ago',
    type: 'course',
  },
  {
    action: 'News article published',
    item: 'New scholarship programs announced',
    time: '3 days ago',
    type: 'news',
  },
]

const typeMeta: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  college: { icon: GraduationCap, color: 'text-[#ea580c]', bg: 'bg-[#ea580c]/10' },
  exam: { icon: FileText, color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10' },
  enquiry: { icon: MessageSquare, color: 'text-[#ea580c]', bg: 'bg-[#ea580c]/10' },
  blog: { icon: BookOpen, color: 'text-[#fbbf24]', bg: 'bg-[#fbbf24]/10' },
  country: { icon: Globe, color: 'text-[#059669]', bg: 'bg-[#059669]/10' },
  course: { icon: Library, color: 'text-[#f97316]', bg: 'bg-[#f97316]/10' },
  news: { icon: Newspaper, color: 'text-[#fb923c]', bg: 'bg-[#fb923c]/10' },
}

export function RecentActivity() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-[#12161e] ring-1 ring-white/[0.05]">
      <div className="flex items-center justify-between border-b border-white/[0.04] px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-white">Recent Activity</h2>
          <p className="text-xs text-[#6b7280]">Latest platform updates</p>
        </div>
        <span className="rounded-full bg-[#0c0f14] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-[#6b7280] ring-1 ring-white/[0.05]">
          Live
        </span>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto p-3">
        {recentActivities.map((activity, index) => {
          const meta = typeMeta[activity.type] || typeMeta.college
          const Icon = meta.icon
          return (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[#0c0f14]/80"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${meta.bg}`}
              >
                <Icon className={`h-4 w-4 ${meta.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{activity.action}</p>
                <p className="truncate text-xs text-[#6b7280]">{activity.item}</p>
              </div>
              <div className="shrink-0 text-[11px] text-[#4b5563]">{activity.time}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
