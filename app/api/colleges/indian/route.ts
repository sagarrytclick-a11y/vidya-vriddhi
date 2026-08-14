import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { get, set } from '@/lib/cache'
import { unstable_cache } from 'next/cache'

const getIndiaCountryId = unstable_cache(
  async () => {
    const india = await db.country.findFirst({
      where: { name: { equals: 'India', mode: 'insensitive' } },
      select: { id: true },
    })
    return india?.id ?? null
  },
  ['india-country-id'],
  { revalidate: 86400 }
)

/** Lean list payload — only fields the colleges page needs */
const collegeListSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  establishment_year: true,
  Countryranking: true,
  Internationalranking: true,
  logoURL: true,
  imageURL: true,
  city: {
    select: { id: true, name: true, slug: true },
  },
  country: {
    select: { id: true, name: true, slug: true, flagEmoji: true },
  },
  categories: {
    select: { id: true, name: true, slug: true },
    take: 3,
  },
  courses: {
    select: { id: true, name: true },
    take: 3,
  },
  _count: {
    select: { courses: true },
  },
} as const

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
    const limit = Math.min(24, Math.max(1, parseInt(searchParams.get('limit') || '12', 10) || 12))
    const skip = (page - 1) * limit

    const category = searchParams.get('category')?.trim() || ''
    const course = searchParams.get('course')?.trim() || ''
    const city = searchParams.get('city')?.trim() || ''
    const exam = searchParams.get('exam')?.trim() || ''
    const search = searchParams.get('search')?.trim() || ''

    const cacheKey = `indian-colleges:v5:${page}:${limit}:${category}:${course}:${city}:${exam}:${search}`
    const cached = get<{
      colleges: unknown[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
      }
    }>(cacheKey)

    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': search
            ? 'public, s-maxage=60, stale-while-revalidate=120'
            : 'public, s-maxage=300, stale-while-revalidate=900',
          'X-Cache': 'HIT',
        },
      })
    }

    const indiaId = await getIndiaCountryId()

    if (!indiaId) {
      const emptyResponse = {
        colleges: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      }
      set(cacheKey, emptyResponse)
      return NextResponse.json(emptyResponse)
    }

    // Prefer indexed fields: countryId + active
    const whereClause: Record<string, unknown> = {
      countryId: indiaId,
      active: true,
    }

    if (search) {
      whereClause.name = { contains: search, mode: 'insensitive' }
    }
    if (category) {
      whereClause.categories = { some: { slug: category } }
    }
    if (course) {
      whereClause.courses = { some: { slug: course } }
    }
    if (city) {
      whereClause.city = { slug: city }
    }
    if (exam) {
      whereClause.exams = { some: { slug: exam } }
    }

    // Avoid nulls: 'last' ranking sort — expensive on large tables
    const [colleges, totalCount] = await Promise.all([
      db.college.findMany({
        where: whereClause,
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
        select: collegeListSelect,
      }),
      db.college.count({ where: whereClause }),
    ])

    const totalPages = Math.ceil(totalCount / limit) || 0
    const response = {
      colleges,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }

    set(cacheKey, response)

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': search
          ? 'public, s-maxage=60, stale-while-revalidate=120'
          : 'public, s-maxage=300, stale-while-revalidate=900',
        'X-Cache': 'MISS',
      },
    })
  } catch (error) {
    console.error('Error fetching Indian colleges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Indian colleges' },
      { status: 500 }
    )
  }
}
