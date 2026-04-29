import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createPaginationParams, createPaginationResponse } from '@/lib/pagination-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = createPaginationParams(searchParams)
    const search = searchParams.get('search') || ''

    // Build where clause for search
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { slug: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {}

    // Get total count and categories in parallel
    const [categories, total] = await Promise.all([
      db.category.findMany({
        where,
        orderBy: {
          name: 'asc'
        },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          active: true,
          categoryImageUrl: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      db.category.count({ where })
    ])

    return NextResponse.json(createPaginationResponse(categories, total, page, limit))
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, categoryImageUrl, active } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if category with same name or slug already exists
    const existingCategory = await db.category.findFirst({
      where: {
        OR: [
          { name },
          { slug }
        ]
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name or slug already exists' },
        { status: 409 }
      )
    }

    const category = await db.category.create({
      data: {
        name,
        slug,
        description,
        categoryImageUrl,
        active: active || false
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
