import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createCitySchema = z.object({
  name: z.string().min(1, 'City name is required'),
  slug: z.string().min(1, 'City slug is required'),
  description: z.string().optional(),
  cityImageURL: z.string().url().optional(),
  features: z.array(z.string()).default([]),
  active: z.boolean().default(false),
  countryId: z.string().min(1, 'Country ID is required'),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [cities, total] = await Promise.all([
      db.city.findMany({
        take: limit,
        skip,
        include: {
          country: {
            select: {
              id: true,
              name: true,
              slug: true,
              flagEmoji: true,
            },
          },
          _count: {
            select: {
              colleges: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      db.city.count()
    ])

    return NextResponse.json({
      cities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = createCitySchema.parse(body)

    // Check if country exists
    const country = await db.country.findUnique({
      where: { id: validatedData.countryId },
    })

    if (!country) {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 404 }
      )
    }

    const city = await db.city.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description || null,
        cityImageURL: validatedData.cityImageURL || null,
        features: validatedData.features,
        active: validatedData.active,
        countryId: validatedData.countryId,
      },
      include: {
        country: {
          select: {
            id: true,
            name: true,
            slug: true,
            flagEmoji: true,
          },
        },
      },
    })

    return NextResponse.json(city, { status: 201 })
  } catch (error) {
    console.error('Error creating city:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create city' },
      { status: 500 }
    )
  }
}
