'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/** Brand orange from SITE_IDENTITY.primaryColor */
export const ADMIN_ORANGE = '#ea580c'
export const ADMIN_ORANGE_HOVER = '#c2410c'

/** Consistent list-page title */
export const adminPageTitleClass =
  'text-lg font-semibold tracking-tight text-white'

/** Consistent list-page subtitle */
export const adminPageSubtitleClass = 'mt-0.5 text-sm text-[#6b7280]'

/** Consistent page padding */
export const adminPagePadClass = 'p-5 lg:p-8'

/** Consistent search / filter field */
export const adminSearchClass =
  'h-10 rounded-xl border-white/6 bg-[#12161e] pl-10 text-sm text-white placeholder:text-[#6b7280] focus-visible:ring-[#ea580c]/30 focus-visible:ring-offset-0'

/** Consistent select/filter trigger next to search */
export const adminFilterClass =
  'h-10 rounded-xl border-white/6 bg-[#12161e] text-white focus:ring-[#ea580c]/30'

/** Primary add/action button on list pages */
export const adminPageActionClass =
  'h-10 rounded-xl bg-[#ea580c] px-4 text-sm font-semibold text-white hover:bg-[#c2410c]'

/** Card shell on list pages */
export const adminCardClass =
  'overflow-hidden rounded-2xl border-white/5 bg-[#12161e] ring-1 ring-white/5'

/** Card title inside tables */
export const adminCardTitleClass = 'text-base font-semibold text-white'

interface AdminPageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function AdminPageHeader({ title, subtitle, action, className }: AdminPageHeaderProps) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-center justify-between gap-3', className)}>
      <div className="min-w-0">
        <h2 className={adminPageTitleClass}>{title}</h2>
        {subtitle ? <p className={adminPageSubtitleClass}>{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

interface AdminSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function AdminSearch({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: AdminSearchProps) {
  return (
    <div className={cn('relative mb-6 max-w-md', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={adminSearchClass}
      />
    </div>
  )
}

/** Dark-theme skeleton pulse for admin */
export function AdminSkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-gradient-to-r from-white/[0.04] via-white/[0.08] to-white/[0.04]',
        className
      )}
    />
  )
}

/** Stats cards skeleton matching admin dashboard */
export function AdminStatsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl bg-[#12161e] p-4 ring-1 ring-white/5"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <AdminSkeletonPulse className="h-3 w-16" />
              <AdminSkeletonPulse className="h-8 w-14" />
            </div>
            <AdminSkeletonPulse className="h-10 w-10 rounded-xl" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <AdminSkeletonPulse className="h-3 w-24" />
            <AdminSkeletonPulse className="h-3 w-3 rounded-full" />
          </div>
          <div className="mt-3 h-[2px] w-full bg-[#ea580c]/20" />
        </div>
      ))}
    </div>
  )
}

/** Table skeleton matching admin dark cards */
export function AdminTableSkeleton({
  rows = 6,
  columns = 5,
}: {
  rows?: number
  columns?: number
}) {
  return (
    <div className={cn(adminCardClass)}>
      <div className="border-b border-white/4 px-5 py-4">
        <AdminSkeletonPulse className="h-5 w-40" />
      </div>
      <div className="border-b border-white/4 px-5 py-3">
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <AdminSkeletonPulse key={i} className="h-3 w-16" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-white/4">
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="grid items-center gap-4 px-5 py-4"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, c) => (
              <AdminSkeletonPulse
                key={c}
                className={cn('h-4', c === 0 ? 'w-28' : c === columns - 1 ? 'w-16' : 'w-20')}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Full page loading skeleton for admin list pages */
export function AdminPageSkeleton({
  showAction = true,
  rows = 6,
  columns = 5,
}: {
  showAction?: boolean
  rows?: number
  columns?: number
}) {
  return (
    <div className={adminPagePadClass}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <AdminSkeletonPulse className="h-6 w-40" />
          <AdminSkeletonPulse className="h-3 w-56" />
        </div>
        {showAction ? <AdminSkeletonPulse className="h-10 w-32 rounded-xl" /> : null}
      </div>
      <AdminSkeletonPulse className="mb-6 h-10 max-w-md rounded-xl" />
      <AdminTableSkeleton rows={rows} columns={columns} />
    </div>
  )
}
