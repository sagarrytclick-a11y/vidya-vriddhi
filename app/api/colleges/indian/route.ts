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

// GET Indian colleges with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
    const skip = (page - 1) * limit

    // Get filter parameters
    const category = searchParams.get('category')?.trim()
    const course = searchParams.get('course')?.trim()
    const city = searchParams.get('city')?.trim()
    const exam = searchParams.get('exam')?.trim()
    const search = searchParams.get('search')?.trim()

    const cacheKey = `indian-colleges:${page}:${limit}:${category || ''}:${course || ''}:${city || ''}:${exam || ''}:${search || ''}`
    const cached = get<{
      colleges: any[]
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
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      })
    }

    const indiaId = await getIndiaCountryId()

    // If India not found, return empty results
    if (!indiaId) {
      const emptyResponse = {
        colleges: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      }

      set(cacheKey, emptyResponse)

      return NextResponse.json(emptyResponse, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
        }
      })
    }

    // Build where clause
    let whereClause: any = {
      countryId: indiaId,
      active: true
    }

    // Add search filter
    if (search) {
      whereClause.name = {
        contains: search,
        mode: 'insensitive'
      }
    }

    // Add category filter
    if (category) {
      whereClause.categories = {
        some: {
          slug: category
        }
      }
    }

    // Add course filter
    if (course) {
      whereClause.courses = {
        some: {
          slug: course
        }
      }
    }

    // Add city filter
    if (city) {
      whereClause.city = {
        slug: city
      }
    }

    // Add exam filter
    if (exam) {
      whereClause.exams = {
        some: {
          slug: exam
        }
      }
    }

    // Fetch Indian colleges with pagination and filters
    const [colleges, totalCount] = await Promise.all([
      db.college.findMany({
        where: whereClause,
        orderBy: [
          { Countryranking: { sort: 'asc', nulls: 'last' } },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          establishment_year: true,
          Countryranking: true,
          logoURL: true,
          imageURL: true,
          city: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          country: {
            select: {
              id: true,
              name: true,
              slug: true,
              flagEmoji: true
            }
          },
          categories: {
            select: {
              id: true,
              name: true,
              slug: true
            },
            take: 3
          },
          _count: {
            select: {
              courses: true
            }
          }
        }
      }),
      db.college.count({
        where: whereClause
      })
    ])

    const response = {
      colleges,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    }

    set(cacheKey, response)

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
  } catch (error) {
    console.error('Error fetching Indian colleges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Indian colleges' },
      { status: 500 }
    )
  }
}
