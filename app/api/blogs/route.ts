import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { createPaginationParams, createPaginationResponse } from '@/lib/pagination-utils'

const createBlogSchema = z.object({
  title: z.string().min(1, 'Blog title is required'),
  slug: z.string().min(1, 'Blog slug is required'),
  content: z.string().min(1, 'Blog content is required'),
  category: z.string().min(1, 'Blog category is required'),
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

    // Fetch blogs with pagination
    const [blogs, total] = await Promise.all([
      db.blog.findMany({
        where,
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
      db.blog.count({ where })
    ])

    return NextResponse.json(createPaginationResponse(blogs, total, page, limit))
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = createBlogSchema.parse(body)

    // Check if blog with same title or slug already exists
    const existingBlog = await db.blog.findFirst({
      where: {
        OR: [
          { title: validatedData.title },
          { slug: validatedData.slug }
        ]
      }
    })

    if (existingBlog) {
      return NextResponse.json(
        { error: 'Blog with this title or slug already exists' },
        { status: 409 }
      )
    }

    const blog = await db.blog.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        content: validatedData.content,
        imageUrl: validatedData.imageUrl || null,
        active: validatedData.active,
      },
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}
