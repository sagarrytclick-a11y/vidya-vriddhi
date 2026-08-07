'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Bell,
  Briefcase,
  Building,
  BookOpen,
  ExternalLink,
  FileText,
  Folder,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Library,
  LogOut,
  MessageSquare,
  Newspaper,
  Search,
  Settings,
  User,
} from 'lucide-react'
import { useEnquiryStats } from '@/hooks/useEnquiries'
import { cn } from '@/lib/utils'

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  '/admin/dashboard': { title: 'Dashboard', subtitle: 'Overview of your education platform' },
  '/admin/countries': { title: 'Countries', subtitle: 'Study destinations' },
  '/admin/cities': { title: 'Cities', subtitle: 'Study locations' },
  '/admin/categories': { title: 'Categories', subtitle: 'Content categories' },
  '/admin/colleges': { title: 'Colleges', subtitle: 'Educational institutions' },
  '/admin/exams': { title: 'Exams', subtitle: 'Standardized tests' },
  '/admin/blogs': { title: 'Blogs', subtitle: 'Published content' },
  '/admin/courses': { title: 'Courses', subtitle: 'Available programs' },
  '/admin/news': { title: 'News', subtitle: 'Latest updates' },
  '/admin/enquiries': { title: 'Enquiries', subtitle: 'Student inquiries' },
  '/admin/job-applications': { title: 'Job Applications', subtitle: 'Career applications' },
}

const searchTargets = [
  { label: 'Dashboard', href: '/admin/dashboard', keywords: 'home overview', icon: LayoutDashboard },
  { label: 'Colleges', href: '/admin/colleges', keywords: 'university institute', icon: GraduationCap },
  { label: 'Courses', href: '/admin/courses', keywords: 'program', icon: Library },
  { label: 'Exams', href: '/admin/exams', keywords: 'test neet jee', icon: FileText },
  { label: 'News', href: '/admin/news', keywords: 'updates', icon: Newspaper },
  { label: 'Blogs', href: '/admin/blogs', keywords: 'articles posts', icon: BookOpen },
  { label: 'Categories', href: '/admin/categories', keywords: 'tags', icon: Folder },
  { label: 'Countries', href: '/admin/countries', keywords: 'destination abroad', icon: Globe },
  { label: 'Cities', href: '/admin/cities', keywords: 'location', icon: Building },
  { label: 'Enquiries', href: '/admin/enquiries', keywords: 'leads contacts students', icon: MessageSquare },
  { label: 'Pending Enquiries', href: '/admin/enquiries?status=PENDING', keywords: 'pending awaiting', icon: MessageSquare },
  { label: 'Follow Up Enquiries', href: '/admin/enquiries?status=FOLLOW_UP', keywords: 'followup follow-up', icon: MessageSquare },
  { label: 'Resolved Enquiries', href: '/admin/enquiries?status=RESOLVED', keywords: 'done completed', icon: MessageSquare },
  { label: 'Job Applications', href: '/admin/job-applications', keywords: 'career resume hiring', icon: Briefcase },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const page = pageTitles[pathname] || { title: 'Admin', subtitle: 'Vidya Vriddhi console' }
  const { stats } = useEnquiryStats()

  const [query, setQuery] = useState('')
  const [openSearch, setOpenSearch] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const searchWrapRef = useRef<HTMLDivElement>(null)

  const alertCount = stats.pending + stats.followUp

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return searchTargets.slice(0, 6)
    return searchTargets
      .filter((item) => {
        const hay = `${item.label} ${item.keywords} ${item.href}`.toLowerCase()
        return hay.includes(q)
      })
      .slice(0, 8)
  }, [query])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!searchWrapRef.current?.contains(e.target as Node)) {
        setOpenSearch(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const goTo = (href: string) => {
    setQuery('')
    setOpenSearch(false)
    router.push(href)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault()
      goTo(results[activeIndex].href)
    } else if (e.key === 'Escape') {
      setOpenSearch(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin-auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        window.location.replace('/admin-login')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/4 bg-[#0a0c10]/80 px-6 py-4 backdrop-blur-xl lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-white">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="mt-0.5 truncate text-sm text-[#6b7280]">{page.subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick navigation search */}
          <div ref={searchWrapRef} className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setOpenSearch(true)
              }}
              onFocus={() => setOpenSearch(true)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Jump to page…"
              className="h-10 w-52 rounded-xl border-white/6 bg-[#151a22] pl-9 text-sm text-white placeholder:text-[#6b7280] focus-visible:ring-[#ea580c]/30 lg:w-64"
              aria-label="Search admin pages"
              autoComplete="off"
            />
            {openSearch && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-80 overflow-hidden rounded-xl border border-white/6 bg-[#12161e] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)]">
                <div className="border-b border-white/4 px-3 py-2">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">
                    {query.trim() ? 'Matching pages' : 'Quick links'}
                  </p>
                </div>
                {results.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-[#6b7280]">No pages found</p>
                ) : (
                  <ul className="max-h-72 overflow-y-auto py-1">
                    {results.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <li key={item.href + item.label}>
                          <button
                            type="button"
                            onClick={() => goTo(item.href)}
                            onMouseEnter={() => setActiveIndex(index)}
                            className={cn(
                              'flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors',
                              index === activeIndex
                                ? 'bg-[#ea580c]/15 text-white'
                                : 'text-[#d1d5db] hover:bg-[#1e2430]'
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0 text-[#ea580c]" />
                            <span className="truncate font-medium">{item.label}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
                <div className="border-t border-white/4 px-3 py-2 text-[10px] text-[#6b7280]">
                  ↑↓ navigate · Enter open · Esc close
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#151a22] text-[#9ca3af] ring-1 ring-white/5 transition hover:bg-[#1a2030] hover:text-white"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="z-[60] min-w-[220px] border-white/6 bg-[#151a22] text-white"
            >
              <DropdownMenuLabel className="text-[#6b7280]">Settings</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/6" />
              <DropdownMenuItem
                className="cursor-pointer focus:bg-[#1e2430] focus:text-white"
                onClick={() => router.push('/admin/dashboard')}
              >
                <LayoutDashboard className="mr-2 h-4 w-4 text-[#9ca3af]" />
                Go to Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer focus:bg-[#1e2430] focus:text-white"
                onClick={() => window.open('/', '_blank', 'noopener,noreferrer')}
              >
                <ExternalLink className="mr-2 h-4 w-4 text-[#9ca3af]" />
                View live website
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer focus:bg-[#1e2430] focus:text-white"
                onClick={() => router.push('/admin/enquiries')}
              >
                <MessageSquare className="mr-2 h-4 w-4 text-[#9ca3af]" />
                Manage enquiries
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/6" />
              <DropdownMenuItem
                className="cursor-pointer text-rose-400 focus:bg-[#1e2430] focus:text-rose-300"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications from real enquiry stats */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#151a22] text-[#9ca3af] ring-1 ring-white/5 transition hover:bg-[#1a2030] hover:text-white"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {alertCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                    {alertCount > 99 ? '99+' : alertCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="z-[60] min-w-[280px] border-white/6 bg-[#151a22] text-white"
            >
              <DropdownMenuLabel className="flex items-center justify-between text-[#6b7280]">
                <span>Notifications</span>
                <span className="text-[11px] text-[#9ca3af]">{alertCount} needs attention</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/6" />
              <DropdownMenuItem
                className="cursor-pointer flex-col items-start gap-0.5 py-3 focus:bg-[#1e2430] focus:text-white"
                onClick={() => router.push('/admin/enquiries?status=PENDING')}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-medium text-amber-300">Pending enquiries</span>
                  <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-xs font-semibold text-amber-300">
                    {stats.pending}
                  </span>
                </div>
                <span className="text-xs text-[#6b7280]">Awaiting your response</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex-col items-start gap-0.5 py-3 focus:bg-[#1e2430] focus:text-white"
                onClick={() => router.push('/admin/enquiries?status=FOLLOW_UP')}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-medium text-[#fdba74]">Follow ups</span>
                  <span className="rounded-md bg-[#ea580c]/15 px-1.5 py-0.5 text-xs font-semibold text-[#fdba74]">
                    {stats.followUp}
                  </span>
                </div>
                <span className="text-xs text-[#6b7280]">Need another contact</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex-col items-start gap-0.5 py-3 focus:bg-[#1e2430] focus:text-white"
                onClick={() => router.push('/admin/enquiries?status=RESOLVED')}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-medium text-emerald-300">Resolved</span>
                  <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-xs font-semibold text-emerald-300">
                    {stats.resolved}
                  </span>
                </div>
                <span className="text-xs text-[#6b7280]">Completed enquiries</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/6" />
              <DropdownMenuItem
                className="cursor-pointer focus:bg-[#1e2430] focus:text-white"
                onClick={() => router.push('/admin/job-applications')}
              >
                <Briefcase className="mr-2 h-4 w-4 text-[#9ca3af]" />
                Review job applications
              </DropdownMenuItem>
              {alertCount === 0 && (
                <p className="px-2 py-2 text-center text-xs text-[#6b7280]">
                  You&apos;re all caught up
                </p>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-full outline-none ring-offset-2 ring-offset-[#0a0c10] focus-visible:ring-2 focus-visible:ring-[#ea580c]/40"
              >
                <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-white/6">
                  <AvatarImage src="/admin-avatar.jpg" alt="Admin" />
                  <AvatarFallback className="bg-gradient-to-br from-[#ea580c] to-[#f97316] text-sm font-bold text-white">
                   VV
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="z-[60] min-w-[180px] border-white/6 bg-[#151a22] text-white"
            >
              <DropdownMenuItem className="flex items-center gap-2 focus:bg-[#1e2430] focus:text-white">
                <User className="h-4 w-4 text-[#9ca3af]" />
                <span>Super Admin</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-2 text-rose-400 focus:bg-[#1e2430] focus:text-rose-300"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
