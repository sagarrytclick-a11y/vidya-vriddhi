import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createPaginationParams, createPaginationResponse } from '@/lib/pagination-utils'
import { categoryCreateSchema, categoryUpdateSchema } from '@/lib/validations/schema'
import { z } from 'zod'
import { requireAdmin, activeContentFilter } from '@/lib/auth'

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

    const visibility = await activeContentFilter(request)
    const filteredWhere = { ...where, ...visibility }

    // Get total count and categories in parallel
    const [categories, total] = await Promise.all([
      db.category.findMany({
        where: filteredWhere,
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
      db.category.count({ where: filteredWhere })
    ])

    return NextResponse.json(createPaginationResponse(categories, total, page, limit), {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    })
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
    const authError = await requireAdmin(request)
    if (authError) return authError

    const body = await request.json()

    // Validate input using Zod schema
    const validatedData = categoryCreateSchema.safeParse(body)
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validatedData.error.issues },
        { status: 400 }
      )
    }

    const { name, slug, description, categoryImageUrl, active } = validatedData.data

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
