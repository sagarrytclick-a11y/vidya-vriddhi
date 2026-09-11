import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createPaginationParams, createPaginationResponse } from '@/lib/pagination-utils'

const TYPES = ['colleges', 'courses', 'exams', 'cities', 'blogs', 'news'] as const
type SitemapType = (typeof TYPES)[number]

function hrefFor(type: SitemapType, slug: string) {
  switch (type) {
    case 'colleges':
      return `/colleges/${slug}`
    case 'courses':
      return `/courses/${slug}`
    case 'exams':
      return `/exams/${slug}`
    case 'cities':
      return `/cities/${slug}`
    case 'blogs':
      return `/blogs/${slug}`
    case 'news':
      return `/news/${slug}`
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as SitemapType | null
    if (!type || !TYPES.includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const { page, limit, skip } = createPaginationParams(searchParams)
    const pageLimit = Math.min(limit, 24)
    const pageSkip = (page - 1) * pageLimit

    const where = { active: true }
    const orderByName = { name: 'asc' as const }
    const orderByTitle = { createdAt: 'desc' as const }

    let items: { slug: string; label: string }[] = []
    let total = 0

    if (type === 'colleges') {
      const [rows, count] = await Promise.all([
        db.college.findMany({
          where,
          select: { name: true, slug: true },
          orderBy: orderByName,
          skip: pageSkip,
          take: pageLimit,
        }),
        db.college.count({ where }),
      ])
      items = rows.map((r) => ({ slug: r.slug, label: r.name }))
      total = count
    } else if (type === 'courses') {
      const [rows, count] = await Promise.all([
        db.course.findMany({
          where,
          select: { name: true, slug: true },
          orderBy: orderByName,
          skip: pageSkip,
          take: pageLimit,
        }),
        db.course.count({ where }),
      ])
      items = rows.map((r) => ({ slug: r.slug, label: r.name }))
      total = count
    } else if (type === 'exams') {
      const [rows, count] = await Promise.all([
        db.exam.findMany({
          where,
          select: { name: true, slug: true },
          orderBy: orderByName,
          skip: pageSkip,
          take: pageLimit,
        }),
        db.exam.count({ where }),
      ])
      items = rows.map((r) => ({ slug: r.slug, label: r.name }))
      total = count
    } else if (type === 'cities') {
      const [rows, count] = await Promise.all([
        db.city.findMany({
          where,
          select: { name: true, slug: true },
          orderBy: orderByName,
          skip: pageSkip,
          take: pageLimit,
        }),
        db.city.count({ where }),
      ])
      items = rows.map((r) => ({ slug: r.slug, label: r.name }))
      total = count
    } else if (type === 'blogs') {
      const [rows, count] = await Promise.all([
        db.blog.findMany({
          where,
          select: { title: true, slug: true },
          orderBy: orderByTitle,
          skip: pageSkip,
          take: pageLimit,
        }),
        db.blog.count({ where }),
      ])
      items = rows.map((r) => ({ slug: r.slug, label: r.title }))
      total = count
    } else {
      const [rows, count] = await Promise.all([
        db.news.findMany({
          where,
          select: { title: true, slug: true },
          orderBy: orderByTitle,
          skip: pageSkip,
          take: pageLimit,
        }),
        db.news.count({ where }),
      ])
      items = rows.map((r) => ({ slug: r.slug, label: r.title }))
      total = count
    }

    const links = items.map((item) => ({
      href: hrefFor(type, item.slug),
      label: item.label,
    }))

    return NextResponse.json(createPaginationResponse(links, total, page, pageLimit), {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error fetching sitemap links:', error)
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 })
  }
}
