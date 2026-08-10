import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAdmin, activeContentFilter } from '@/lib/auth'

// Zod schema for validation
const countrySchema = z.object({
  name: z.string().min(1, 'Country name is required').max(100, 'Country name too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  flagEmoji: z.string().optional(),
  description: z.string().optional(),
  active: z.boolean().default(false)
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const excludeIndia = searchParams.get('excludeIndia') === 'true'

    const whereClause = {
      ...await activeContentFilter(request),
      ...(excludeIndia
        ? {
            NOT: {
              name: {
                equals: 'India',
                mode: 'insensitive' as const,
              },
            },
          }
        : {}),
    }

    const countries = await db.country.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        slug: true,
        flagEmoji: true,
        description: true,
        active: true,
        _count: {
          select: {
            colleges: true,
            cities: true,
          }
        }
      }
    })

    return NextResponse.json({ success: true, countries }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
    })
  } catch (error) {
    console.error('Error fetching countries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin(request)
    if (authError) return authError

    const body = await request.json()

    // Validate data
    const validatedData = countrySchema.parse(body)

    // Check if country with same name or slug already exists
    const existingCountry = await db.country.findFirst({
      where: {
        OR: [
          { name: validatedData.name },
          { slug: validatedData.slug }
        ]
      }
    })

    if (existingCountry) {
      if (existingCountry.name === validatedData.name) {
        return NextResponse.json(
          { error: 'Country with this name already exists' },
          { status: 400 }
        )
      }
      if (existingCountry.slug === validatedData.slug) {
        return NextResponse.json(
          { error: 'Country with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Create country in database
    const country = await db.country.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        flagEmoji: validatedData.flagEmoji,
        description: validatedData.description,
        active: validatedData.active
      }
    })

    return NextResponse.json({ success: true, country }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.issues.reduce((acc: Record<string, string>, err) => {
        const path = err.path[0]
        if (typeof path === 'string') {
          acc[path] = err.message
        }
        return acc
      }, {})

      return NextResponse.json(
        { error: 'Validation failed', fieldErrors },
        { status: 400 }
      )
    }

    console.error('Error creating country:', error)
    return NextResponse.json(
      { error: 'Failed to create country. Please try again.' },
      { status: 500 }
    )
  }
}
