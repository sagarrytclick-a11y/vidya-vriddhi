import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET Indian colleges with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    
    // Find India country (case-insensitive)
    const india = await db.country.findFirst({
      where: { 
        name: {
          equals: 'India',
          mode: 'insensitive'
        }
      }
    })

    // If India not found, return empty results
    if (!india) {
      return NextResponse.json({
        colleges: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      })
    }

    // Fetch Indian colleges with pagination
    const [colleges, totalCount] = await Promise.all([
      db.college.findMany({
        where: {
          countryId: india.id
        },
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
          active: true,
          establishment_year: true,
          Countryranking: true,
          Internationalranking: true,
          logoURL: true,
          imageURL: true,
          createdAt: true,
          updatedAt: true,
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
          courses: {
            select: {
              id: true,
              name: true,
              slug: true
            },
            take: 5
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
              categories: true,
              courses: true,
              exams: true
            }
          }
        }
      }),
      db.college.count({
        where: {
          countryId: india.id
        }
      })
    ])

    return NextResponse.json({
      colleges,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
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
