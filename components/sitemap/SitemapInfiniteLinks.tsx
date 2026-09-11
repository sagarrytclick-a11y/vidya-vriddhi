'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type SitemapLink = {
  href: string
  label: string
}

type SitemapType = 'colleges' | 'courses' | 'exams' | 'cities' | 'blogs' | 'news'

interface SitemapInfiniteLinksProps {
  type: SitemapType
  initialLinks: SitemapLink[]
  total: number
  pageSize?: number
}

export function SitemapInfiniteLinks({
  type,
  initialLinks,
  total,
  pageSize = 24,
}: SitemapInfiniteLinksProps) {
  const [links, setLinks] = useState(initialLinks)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const loadingRef = useRef(false)

  const hasMore = links.length < total

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setLoading(true)

    try {
      const nextPage = page + 1
      const res = await fetch(
        `/api/sitemap-links?type=${type}&page=${nextPage}&limit=${pageSize}`
      )
      if (!res.ok) return
      const json = await res.json()
      const nextLinks: SitemapLink[] = json.data || []
      setLinks((prev) => {
        const seen = new Set(prev.map((l) => l.href))
        return [...prev, ...nextLinks.filter((l) => !seen.has(l.href))]
      })
      setPage(nextPage)
    } catch {
      // keep current list
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [hasMore, page, pageSize, type])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { root: node.parentElement, rootMargin: '80px', threshold: 0.1 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  return (
    <div className="max-h-80 overflow-y-auto">
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 p-4 sm:p-5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0 group-hover:scale-125 transition-transform" />
              <span className="truncate">{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div ref={sentinelRef} className="h-4" />
      {loading && (
        <p className="pb-4 text-center text-xs text-slate-400">Loading more…</p>
      )}
      {!hasMore && total > pageSize && (
        <p className="pb-4 text-center text-xs text-slate-400">
          Showing all {total.toLocaleString()}
        </p>
      )}
    </div>
  )
}
