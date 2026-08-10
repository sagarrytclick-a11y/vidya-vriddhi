'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Globe,
  Building,
  Folder,
  GraduationCap,
  FileText,
  BookOpen,
  MessageSquare,
  Library,
  Newspaper,
  Briefcase,
  Users,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEnquiryStats } from '@/hooks/useEnquiries'
import { useAdminContext } from '@/contexts/admin-context'

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/colleges', label: 'Colleges', icon: GraduationCap },
  { href: '/admin/courses', label: 'Courses', icon: Library },
  { href: '/admin/exams', label: 'Exams', icon: FileText },
  { href: '/admin/news', label: 'News', icon: Newspaper },
]

const contentItems = [
  { href: '/admin/blogs', label: 'Blogs', icon: BookOpen },
  { href: '/admin/categories', label: 'Categories', icon: Folder },
  { href: '/admin/countries', label: 'Countries', icon: Globe },
  { href: '/admin/cities', label: 'Cities', icon: Building },
]

const accountItems = [
  { href: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { href: '/admin/job-applications', label: 'Job Applications', icon: Briefcase },
]

function NavSection({
  title,
  items,
  pathname,
  alertHref,
  showAlert,
}: {
  title: string
  items: Array<{
    href: string
    label: string
    icon: React.ComponentType<{ className?: string }>
  }>
  pathname: string
  alertHref?: string
  showAlert?: boolean
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
        {title}
      </p>
      <nav className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`)
          const alert = showAlert && alertHref === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                active
                  ? 'bg-[#1e2430] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]'
                  : 'text-[#9ca3af] hover:bg-[#161b24] hover:text-white'
              )}
            >
              <Icon
                className={cn(
                  'h-[18px] w-[18px] shrink-0 transition-colors',
                  active ? 'text-[#ea580c]' : 'text-[#6b7280] group-hover:text-[#9ca3af]'
                )}
              />
              <span className="flex-1 truncate font-medium">{item.label}</span>
              {alert && (
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const { stats } = useEnquiryStats()
  const { user, role, canDelete, canViewLeads } = useAdminContext()
  const hasOpenEnquiries = (stats.pending || 0) + (stats.followUp || 0) > 0
  const accountNav = [
    ...(canViewLeads ? accountItems : []),
    ...(role === 'superadmin'
      ? [{ href: '/admin/staff', label: 'Staff accounts', icon: Users }]
      : []),
  ]

  const roleLabel =
    role === 'superadmin'
      ? 'Super Admin'
      : role === 'admin'
        ? 'Admin'
        : role === 'content_writer'
          ? 'Content Writer'
          : 'Staff'

  return (
    <aside className="admin-sidebar relative flex h-screen w-[260px] shrink-0 flex-col border-r border-white/[0.04] bg-[#0c0f14]">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/favicon.ico"
            alt="Vidya Vriddhi"
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight text-white">Vidya Vriddhi</p>
          <p className="text-[11px] text-[#6b7280]">Admin Console</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
        <NavSection title="Menu" items={menuItems} pathname={pathname} />
        <NavSection title="Content" items={contentItems} pathname={pathname} />
        {accountNav.length > 0 && (
          <NavSection
            title="Account"
            items={accountNav}
            pathname={pathname}
            alertHref="/admin/enquiries"
            showAlert={canViewLeads && hasOpenEnquiries}
          />
        )}
      </div>

      <div className="border-t border-white/[0.04] p-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#151a22] to-[#0f1319] p-4 ring-1 ring-white/[0.05]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
            Signed in
          </p>
          <p className="mt-1 truncate text-sm font-medium text-white">
            {user?.name || 'Admin'}
          </p>
          <p className="mt-0.5 text-xs text-[#9ca3af]">{roleLabel}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-[#6b7280]">
            {canDelete
              ? 'Full access including delete.'
              : 'Can create & edit. Delete is blocked.'}
          </p>
        </div>
      </div>
    </aside>
  )
}
