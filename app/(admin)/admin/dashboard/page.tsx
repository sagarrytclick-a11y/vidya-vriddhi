'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout'
import { StatsCards } from '@/components/admin/stats-cards'
import { RecentActivity } from '@/components/admin/recent-activity'
import { QuickActions } from '@/components/admin/quick-actions'
import {
  TrendingUp,
  Calendar,
  ArrowUpRight,
  MessageSquare,
  BookOpen,
  GraduationCap,
  Library,
  FileText,
  Newspaper,
  Folder,
  ExternalLink,
} from 'lucide-react'
import { useEnquiryStats } from '@/hooks/useEnquiries'
import { useColleges } from '@/hooks/useColleges'
import { useAdminCourses } from '@/hooks/useAdminCourses'
import { useAdminExams } from '@/hooks/useAdminExams'
import { useAdminNews } from '@/hooks/useAdminNews'
import { useAdminBlogs } from '@/hooks/useAdminBlogs'
import { useCategoryCount } from '@/hooks/useCategories'
import { cn } from '@/lib/utils'

type OverviewTab = 'overview' | 'enquiries' | 'content'

type ChartSlice = { name: string; value: number; color: string }
type BarItem = { name: string; value: number; fill: string }

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number
) {
  const startOuter = polarToCartesian(cx, cy, outerR, endAngle)
  const endOuter = polarToCartesian(cx, cy, outerR, startAngle)
  const startInner = polarToCartesian(cx, cy, innerR, endAngle)
  const endInner = polarToCartesian(cx, cy, innerR, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 1 ${startInner.x} ${startInner.y}`,
    'Z',
  ].join(' ')
}

function DonutChart({
  data,
  size = 180,
  thickness = 28,
  centerLabel,
  centerValue,
}: {
  data: ChartSlice[]
  size?: number
  thickness?: number
  centerLabel?: string
  centerValue?: string
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const cx = size / 2
  const cy = size / 2
  const outerR = size / 2 - 4
  const innerR = outerR - thickness

  if (total <= 0) {
    return (
      <div className="flex h-[180px] items-center justify-center text-sm text-[#6b7280]">
        No data yet
      </div>
    )
  }

  let angle = 0
  const slices = data.map((item) => {
    const sweep = (item.value / total) * 360
    const start = angle
    const end = angle + Math.max(sweep, 0.8)
    angle = end
    return { ...item, start, end }
  })

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((slice) => (
          <path
            key={slice.name}
            d={describeArc(cx, cy, innerR, outerR, slice.start, slice.end - 1.2)}
            fill={slice.color}
          />
        ))}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && (
            <span className="text-xl font-semibold tabular-nums text-white">{centerValue}</span>
          )}
          {centerLabel && <span className="text-[10px] text-[#6b7280]">{centerLabel}</span>}
        </div>
      )}
    </div>
  )
}

function VerticalBarChart({ data }: { data: BarItem[] }) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="flex h-52 items-end gap-2 px-1 pt-2">
      {data.map((item) => {
        const heightPct = Math.max(8, (item.value / max) * 100)
        return (
          <div key={item.name} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <span className="text-[10px] font-semibold tabular-nums text-[#d1d5db]">
              {item.value}
            </span>
            <div className="flex h-36 w-full items-end justify-center rounded-lg bg-white/[0.02] px-1">
              <div
                className="w-full max-w-8 rounded-t-md transition-all"
                style={{ height: `${heightPct}%`, backgroundColor: item.fill }}
                title={`${item.name}: ${item.value}`}
              />
            </div>
            <span className="w-full truncate text-center text-[10px] text-[#6b7280]">
              {item.name}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function HorizontalBarChart({ data }: { data: BarItem[] }) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const widthPct = Math.max(4, (item.value / max) * 100)
        return (
          <div key={item.name}>
            <div className="mb-1 flex items-center justify-between gap-2 text-xs">
              <span className="text-[#9ca3af]">{item.name}</span>
              <span className="font-semibold tabular-nums text-white">{item.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#12161e]">
              <div
                className="h-full rounded-full"
                style={{ width: `${widthPct}%`, backgroundColor: item.fill }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

const eventDotColors = [
  'bg-[#ea580c]',
  'bg-[#f59e0b]',
  'bg-[#fb923c]',
  'bg-[#fbbf24]',
  'bg-[#fdba74]',
  'bg-[#c2410c]',
]

function parseEventDate(dateStr: string): { sortKey: number; label: string } {
  const trimmed = (dateStr || '').trim()
  if (!trimmed || /^(tba|tbd|n\/a|na|-)$/i.test(trimmed)) {
    return { sortKey: Number.POSITIVE_INFINITY, label: trimmed || 'TBA' }
  }

  const parsed = Date.parse(trimmed)
  if (!Number.isNaN(parsed)) {
    return {
      sortKey: parsed,
      label: new Date(parsed).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    }
  }

  const slash = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/)
  if (slash) {
    const year = slash[3].length === 2 ? Number(`20${slash[3]}`) : Number(slash[3])
    const d = new Date(year, Number(slash[2]) - 1, Number(slash[1]))
    if (!Number.isNaN(d.getTime())) {
      return {
        sortKey: d.getTime(),
        label: d.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      }
    }
  }

  return { sortKey: Number.POSITIVE_INFINITY, label: trimmed }
}

function OverviewPanel() {
  const router = useRouter()
  const [tab, setTab] = useState<OverviewTab>('overview')

  const { stats, isLoading: statsLoading } = useEnquiryStats()
  const { pagination: collegePagination, colleges, isLoading: collegesLoading } = useColleges()
  const { pagination: coursePagination, courses, isLoading: coursesLoading } = useAdminCourses()
  const {
    exams,
    pagination: examPagination,
    isLoading: examsLoading,
    setLimit: setExamLimit,
  } = useAdminExams()
  const { total: newsTotal, isLoading: newsLoading } = useAdminNews(1, 0)
  const { total: blogTotal, loading: blogsLoading } = useAdminBlogs(1, 0)
  const { count: categoryCount, isLoading: categoriesLoading } = useCategoryCount()

  useEffect(() => {
    setExamLimit(50)
  }, [setExamLimit])

  const collegeTotal = collegePagination?.total || colleges.length
  const courseTotal = coursePagination?.total || courses.length
  const examTotal = examPagination?.total || exams.length
  const openEnquiries = stats.pending + stats.followUp

  const upcomingEvents = useMemo(() => {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const todayMs = startOfToday.getTime()

    const events: Array<{
      key: string
      title: string
      examName: string
      dateLabel: string
      sortKey: number
      href: string
      color: string
    }> = []

    exams.forEach((exam) => {
      const dates = exam.examDates?.importantDates
      if (!Array.isArray(dates)) return

      dates.forEach((item: { event?: string; date?: string }, index: number) => {
        const eventName = (item?.event || '').trim()
        const rawDate = (item?.date || '').trim()
        if (!eventName && !rawDate) return

        const { sortKey, label } = parseEventDate(rawDate)
        const isUpcoming = sortKey === Number.POSITIVE_INFINITY || sortKey >= todayMs
        if (!isUpcoming) return

        events.push({
          key: `${exam.id}-${index}-${eventName}-${rawDate}`,
          title: eventName || exam.shortName || exam.name,
          examName: exam.shortName || exam.name,
          dateLabel: label,
          sortKey,
          href: '/admin/exams',
          color: eventDotColors[events.length % eventDotColors.length],
        })
      })
    })

    return events
      .sort((a, b) => a.sortKey - b.sortKey)
      .slice(0, 6)
  }, [exams])

  const overviewCards = [
    {
      label: 'Total Enquiries',
      value: stats.total,
      hint: `${openEnquiries} need attention`,
      href: '/admin/enquiries',
      icon: MessageSquare,
    },
    {
      label: 'Colleges Listed',
      value: collegeTotal,
      hint: 'Active catalog',
      href: '/admin/colleges',
      icon: GraduationCap,
    },
    {
      label: 'Courses',
      value: courseTotal,
      hint: 'Programs',
      href: '/admin/courses',
      icon: Library,
    },
  ]

  const enquiryRows = [
    {
      label: 'Pending',
      value: stats.pending,
      href: '/admin/enquiries?status=PENDING',
      color: 'bg-[#fb7185]',
      chartColor: '#fb7185',
    },
    {
      label: 'Follow Up',
      value: stats.followUp,
      href: '/admin/enquiries?status=FOLLOW_UP',
      color: 'bg-[#fbbf24]',
      chartColor: '#fbbf24',
    },
    {
      label: 'Resolved',
      value: stats.resolved,
      href: '/admin/enquiries?status=RESOLVED',
      color: 'bg-[#34d399]',
      chartColor: '#34d399',
    },
  ]

  const enquiryPieData = enquiryRows
    .map((row) => ({ name: row.label, value: row.value, color: row.chartColor }))
    .filter((row) => row.value > 0)

  const catalogBarData = [
    { name: 'Colleges', value: collegeTotal, fill: '#ea580c' },
    { name: 'Courses', value: courseTotal, fill: '#f59e0b' },
    { name: 'Exams', value: examTotal, fill: '#fb923c' },
    { name: 'Blogs', value: blogTotal, fill: '#fdba74' },
    { name: 'News', value: newsTotal, fill: '#c2410c' },
    { name: 'Categories', value: categoryCount, fill: '#a8a29e' },
  ]

  const contentCards = [
    { label: 'Exams', value: examTotal, href: '/admin/exams', icon: FileText, fill: '#fb923c' },
    { label: 'Blogs', value: blogTotal, href: '/admin/blogs', icon: BookOpen, fill: '#fdba74' },
    { label: 'News', value: newsTotal, href: '/admin/news', icon: Newspaper, fill: '#c2410c' },
    { label: 'Categories', value: categoryCount, href: '/admin/categories', icon: Folder, fill: '#a8a29e' },
  ]

  const loading =
    statsLoading ||
    collegesLoading ||
    coursesLoading ||
    examsLoading ||
    newsLoading ||
    blogsLoading ||
    categoriesLoading

  const resolvedRate = stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="overflow-hidden rounded-2xl bg-[#12161e] p-5 ring-1 ring-white/[0.05] lg:col-span-2">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#ea580c]" />
            <h2 className="text-base font-semibold text-white">Platform Overview</h2>
          </div>
          <div className="flex gap-1 rounded-full bg-[#0c0f14] p-1 ring-1 ring-white/[0.05]">
            {(
              [
                { id: 'overview', label: 'Overview' },
                { id: 'enquiries', label: 'Enquiries' },
                { id: 'content', label: 'Content' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  tab === item.id
                    ? 'bg-[#ea580c]/15 text-[#ea580c]'
                    : 'text-[#6b7280] hover:text-[#d1d5db]'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-[#0c0f14]" />
              ))}
            </div>
            <div className="h-56 animate-pulse rounded-xl bg-[#0c0f14]" />
          </div>
        ) : tab === 'overview' ? (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {overviewCards.map((card) => {
                const Icon = card.icon
                return (
                  <button
                    key={card.label}
                    type="button"
                    onClick={() => router.push(card.href)}
                    className="rounded-xl bg-[#0c0f14] p-4 text-left ring-1 ring-white/[0.04] transition hover:ring-[#ea580c]/30"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#6b7280]">{card.label}</p>
                      <Icon className="h-3.5 w-3.5 text-[#ea580c]" />
                    </div>
                    <p className="mt-2 text-2xl font-semibold tabular-nums text-white">{card.value}</p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-[#9ca3af]">
                      <ArrowUpRight className="h-3.5 w-3.5 text-[#ea580c]" />
                      <span>{card.hint}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Enquiry pie chart */}
              <div className="rounded-xl bg-[#0c0f14] p-4 ring-1 ring-white/[0.04]">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Enquiry Status</p>
                    <p className="text-xs text-[#6b7280]">Pending · Follow up · Resolved</p>
                  </div>
                  <span className="rounded-full bg-[#ea580c]/10 px-2.5 py-1 text-[11px] font-semibold text-[#fdba74]">
                    {resolvedRate}% resolved
                  </span>
                </div>

                {enquiryPieData.length === 0 ? (
                  <div className="flex h-52 items-center justify-center text-sm text-[#6b7280]">
                    No enquiry data yet
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 sm:flex-row">
                    <DonutChart
                      data={enquiryPieData}
                      centerValue={`${resolvedRate}%`}
                      centerLabel="resolved"
                    />
                    <div className="w-full space-y-2 sm:w-36">
                      {enquiryRows.map((row) => (
                        <button
                          key={row.label}
                          type="button"
                          onClick={() => router.push(row.href)}
                          className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition hover:bg-white/[0.03]"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: row.chartColor }}
                            />
                            <span className="text-xs text-[#9ca3af]">{row.label}</span>
                          </div>
                          <span className="text-xs font-semibold tabular-nums text-white">
                            {row.value}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Catalog bar chart */}
              <div className="rounded-xl bg-[#0c0f14] p-4 ring-1 ring-white/[0.04]">
                <div className="mb-3">
                  <p className="text-sm font-medium text-white">Catalog Snapshot</p>
                  <p className="text-xs text-[#6b7280]">Colleges, courses & content volume</p>
                </div>
                <VerticalBarChart data={catalogBarData} />
              </div>
            </div>
          </>
        ) : tab === 'enquiries' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-[#0c0f14] p-4 ring-1 ring-white/[0.04]">
                <p className="text-xs text-[#6b7280]">All enquiries</p>
                <p className="mt-2 text-2xl font-semibold tabular-nums text-white">{stats.total}</p>
              </div>
              <div className="rounded-xl bg-[#0c0f14] p-4 ring-1 ring-white/[0.04]">
                <p className="text-xs text-[#6b7280]">Needs attention</p>
                <p className="mt-2 text-2xl font-semibold tabular-nums text-[#fdba74]">{openEnquiries}</p>
              </div>
              <div className="rounded-xl bg-[#0c0f14] p-4 ring-1 ring-white/[0.04]">
                <p className="text-xs text-[#6b7280]">Resolved rate</p>
                <p className="mt-2 text-2xl font-semibold tabular-nums text-emerald-300">
                  {resolvedRate}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl bg-[#0c0f14] p-4 ring-1 ring-white/[0.04]">
                <p className="mb-3 text-sm font-medium text-white">Status distribution</p>
                <DonutChart
                  data={enquiryPieData}
                  size={200}
                  thickness={32}
                  centerValue={String(stats.total)}
                  centerLabel="total"
                />
                <div className="mt-3 flex flex-wrap justify-center gap-3">
                  {enquiryRows.map((row) => (
                    <div key={row.label} className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: row.chartColor }}
                      />
                      {row.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {enquiryRows.map((row) => (
                  <button
                    key={row.label}
                    type="button"
                    onClick={() => router.push(row.href)}
                    className="flex w-full items-center justify-between rounded-xl bg-[#0c0f14] px-4 py-3 ring-1 ring-white/[0.04] transition hover:ring-[#ea580c]/30"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: row.chartColor }}
                      />
                      <span className="text-sm text-[#d1d5db]">{row.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold tabular-nums text-white">{row.value}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-[#6b7280]" />
                    </div>
                  </button>
                ))}

                <div className="rounded-xl bg-[#0c0f14] p-4 ring-1 ring-white/[0.04]">
                  <p className="mb-3 text-xs text-[#6b7280]">Share of total</p>
                  <div className="space-y-3">
                    {enquiryRows.map((row) => (
                      <div key={row.label}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-[#9ca3af]">{row.label}</span>
                          <span className="tabular-nums text-white">
                            {stats.total
                              ? `${Math.round((row.value / stats.total) * 100)}%`
                              : '0%'}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-[#12161e]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(100, (row.value / Math.max(stats.total, 1)) * 100)}%`,
                              backgroundColor: row.chartColor,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {contentCards.map((card) => {
                const Icon = card.icon
                return (
                  <button
                    key={card.label}
                    type="button"
                    onClick={() => router.push(card.href)}
                    className="rounded-xl bg-[#0c0f14] p-4 text-left ring-1 ring-white/[0.04] transition hover:ring-[#ea580c]/30"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#6b7280]">{card.label}</p>
                      <Icon className="h-3.5 w-3.5 text-[#ea580c]" />
                    </div>
                    <p className="mt-2 text-2xl font-semibold tabular-nums text-white">{card.value}</p>
                    <p className="mt-1 text-xs text-[#6b7280]">Open {card.label.toLowerCase()}</p>
                  </button>
                )
              })}
            </div>

            <div className="rounded-xl bg-[#0c0f14] p-4 ring-1 ring-white/[0.04]">
              <p className="mb-1 text-sm font-medium text-white">Content inventory</p>
              <p className="mb-4 text-xs text-[#6b7280]">Volume across platform modules</p>
              <HorizontalBarChart data={catalogBarData} />
            </div>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl bg-[#12161e] p-5 ring-1 ring-white/[0.05]">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#ea580c]" />
            <h2 className="text-base font-semibold text-white">Upcoming Events</h2>
          </div>
          <button
            type="button"
            onClick={() => router.push('/admin/exams')}
            className="text-xs font-medium text-[#ea580c] hover:text-[#fdba74]"
          >
            View exams
          </button>
        </div>

        {examsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-[#0c0f14]" />
            ))}
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="rounded-xl bg-[#0c0f14] px-4 py-8 text-center ring-1 ring-white/[0.04]">
            <p className="text-sm text-[#9ca3af]">No upcoming exam dates found</p>
            <p className="mt-1 text-xs text-[#6b7280]">
              Add important dates on exam records to see them here
            </p>
            <button
              type="button"
              onClick={() => router.push('/admin/exams')}
              className="mt-4 text-xs font-medium text-[#ea580c] hover:text-[#fdba74]"
            >
              Manage exams
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <button
                key={event.key}
                type="button"
                onClick={() => router.push(event.href)}
                className="flex w-full items-center gap-3 rounded-xl bg-[#0c0f14] px-3 py-3 text-left ring-1 ring-white/[0.04] transition hover:ring-[#ea580c]/30"
              >
                <div className={cn('h-2 w-2 shrink-0 rounded-full', event.color)} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{event.title}</p>
                  <p className="truncate text-xs text-[#6b7280]">{event.examName}</p>
                </div>
                <span className="shrink-0 text-[11px] font-medium tabular-nums text-[#fdba74]">
                  {event.dateLabel}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-5 p-5 lg:p-8">
        <StatsCards />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="min-h-[420px]">
            <RecentActivity />
          </div>
          <div className="min-h-[420px]">
            <QuickActions />
          </div>
        </div>

        <OverviewPanel />
      </div>
    </AdminLayout>
  )
}
