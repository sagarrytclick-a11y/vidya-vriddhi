import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { createPaginationParams, createPaginationResponse } from '@/lib/pagination-utils'
import { requireAdmin, activeContentFilter } from '@/lib/auth'

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
    const { page, limit, skip } = createPaginationParams(searchParams)
    const search = searchParams.get('search') || ''

    // Public: active only. Admin cookie: all (including drafts)
    const where = {
      ...await activeContentFilter(request),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { slug: { contains: search, mode: 'insensitive' as const } },
              { description: { contains: search, mode: 'insensitive' as const } },
              { country: { name: { contains: search, mode: 'insensitive' as const } } },
            ],
          }
        : {}),
    }

    // Fetch cities with pagination
    const [cities, total] = await Promise.all([
      db.city.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          cityImageURL: true,
          features: true,
          active: true,
          countryId: true,
          createdAt: true,
          updatedAt: true,
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
      db.city.count({ where })
    ])

    return NextResponse.json(createPaginationResponse(cities, total, page, limit), {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
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
    const authError = await requireAdmin(request)
    if (authError) return authError

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
