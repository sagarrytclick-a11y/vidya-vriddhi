import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { get, set } from '@/lib/cache'
import { unstable_cache } from 'next/cache'

const SIDEBAR_LIMIT = 40

const fetchFiltersFromDb = unstable_cache(
  async () => {
    const [categories, courses, cities, exams] = await Promise.all([
      db.category.findMany({
        where: { active: true },
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' },
      }),
      db.course.findMany({
        where: { active: true },
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' },
        take: SIDEBAR_LIMIT,
      }),
      db.city.findMany({
        where: { active: true },
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' },
        take: SIDEBAR_LIMIT,
      }),
      db.exam.findMany({
        where: { active: true },
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' },
        take: SIDEBAR_LIMIT,
      }),
    ])

    return { categories, courses, cities, exams }
  },
  ['filters-data-v2'],
  { revalidate: 3600 }
)

export async function GET() {
  try {
    const cacheKey = 'filters-data-v2'
    const cached = get<{
      categories: unknown[]
      courses: unknown[]
      cities: unknown[]
      exams: unknown[]
    }>(cacheKey)

    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
          'X-Cache': 'HIT',
        },
      })
    }

    const data = await fetchFiltersFromDb()
    set(cacheKey, data)

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'X-Cache': 'MISS',
      },
    })
  } catch (error) {
    console.error('Error fetching filters:', error)
    return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 })
  }
}
