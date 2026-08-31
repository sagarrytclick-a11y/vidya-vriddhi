import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { createPaginationParams, createPaginationResponse } from '@/lib/pagination-utils'
import { requireAdmin, activeContentFilter, isAdminRequest } from '@/lib/auth'

const createNewsSchema = z.object({
  title: z.string().min(1, 'News title is required'),
  slug: z.string().min(1, 'News slug is required'),
  content: z.string().min(1, 'News content is required'),
  imageUrl: z.string().url().optional(),
  active: z.boolean().default(false),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = createPaginationParams(searchParams)
    const search = searchParams.get('search') || ''

    // Build where clause for search
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { slug: { contains: search, mode: 'insensitive' as const } },
            { content: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {}

    const visibility = await activeContentFilter(request)
    const filteredWhere = { ...where, ...visibility }

    // Fetch news with pagination
    const [news, total] = await Promise.all([
      db.news.findMany({
        where: filteredWhere,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          imageUrl: true,
          active: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      db.news.count({ where: filteredWhere })
    ])

    const isAdmin = isAdminRequest(request)
    return NextResponse.json(createPaginationResponse(news, total, page, limit), {
      headers: {
        'Cache-Control': isAdmin
          ? 'private, no-store'
          : search
            ? 'public, s-maxage=60, stale-while-revalidate=120'
            : 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
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
    const validatedData = createNewsSchema.parse(body)

    // Check if news with same title or slug already exists
    const existingNews = await db.news.findFirst({
      where: {
        OR: [
          { title: validatedData.title },
          { slug: validatedData.slug }
        ]
      }
    })

    if (existingNews) {
      return NextResponse.json(
        { error: 'News with this title or slug already exists' },
        { status: 409 }
      )
    }

    const news = await db.news.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        content: validatedData.content,
        imageUrl: validatedData.imageUrl || null,
        active: validatedData.active,
      },
    })

    return NextResponse.json(news, { status: 201 })
  } catch (error) {
    console.error('Error creating news:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    )
  }
}
