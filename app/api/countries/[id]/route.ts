import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

// Zod schema for validation
const countrySchema = z.object({
  name: z.string().min(1, 'Country name is required').max(100, 'Country name too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  flagEmoji: z.string().optional(),
  description: z.string().optional(),
  active: z.boolean().default(false)
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = requireAdmin(request)
    if (authError) return authError

    const { id } = await params
    const body = await request.json()

    // Validate data
    const validatedData = countrySchema.parse(body)

    // Check if another country with same name or slug already exists
    const existingCountry = await db.country.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              { name: validatedData.name },
              { slug: validatedData.slug }
            ]
          }
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

    // Update country in database
    const country = await db.country.update({
      where: { id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        flagEmoji: validatedData.flagEmoji,
        description: validatedData.description,
        active: validatedData.active
      }
    })

    return NextResponse.json({ success: true, country })

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

    console.error('Error updating country:', error)
    return NextResponse.json(
      { error: 'Failed to update country. Please try again.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = requireAdmin(request)
    if (authError) return authError

    const { id } = await params

    // Check if country exists
    const country = await db.country.findUnique({
      where: { id }
    })

    if (!country) {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 404 }
      )
    }

    // Delete country from database
    await db.country.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting country:', error)
    return NextResponse.json(
      { error: 'Failed to delete country. Please try again.' },
      { status: 500 }
    )
  }
}
