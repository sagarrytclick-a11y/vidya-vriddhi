import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const city = await db.city.findUnique({
      where: { id },
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

    if (!city) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(city)
  } catch (error) {
    console.error('Error fetching city:', error)
    return NextResponse.json(
      { error: 'Failed to fetch city' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = requireAdmin(request)
    if (authError) return authError

    const { id } = await params
    const body = await request.json()
    const { description, cityImageURL, features, active, countryId } = body

    // Check if city exists
    const existingCity = await db.city.findUnique({
      where: { id },
    })

    if (!existingCity) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      )
    }

    // If countryId is provided, check if country exists
    if (countryId) {
      const country = await db.country.findUnique({
        where: { id: countryId },
      })

      if (!country) {
        return NextResponse.json(
          { error: 'Country not found' },
          { status: 404 }
        )
      }
    }

    const city = await db.city.update({
      where: { id },
      data: {
        ...(description !== undefined && { description }),
        ...(cityImageURL !== undefined && { cityImageURL }),
        ...(features !== undefined && { features }),
        ...(active !== undefined && { active }),
        ...(countryId && { countryId }),
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

    return NextResponse.json(city)
  } catch (error) {
    console.error('Error updating city:', error)
    return NextResponse.json(
      { error: 'Failed to update city' },
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
    // Check if city exists
    const existingCity = await db.city.findUnique({
      where: { id },
      include: {
        colleges: {
          select: { id: true },
        },
      },
    })

    if (!existingCity) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      )
    }

    // Check if city has associated colleges
    if (existingCity.colleges.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete city with associated colleges' },
        { status: 400 }
      )
    }

    await db.city.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'City deleted successfully' })
  } catch (error) {
    console.error('Error deleting city:', error)
    return NextResponse.json(
      { error: 'Failed to delete city' },
      { status: 500 }
    )
  }
}
