import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

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
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = parseInt(searchParams.get('skip') || '0')

    const [blogs, total] = await Promise.all([
      db.blog.findMany({
        take: limit,
        skip: skip,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      db.blog.count()
    ])

    return NextResponse.json({ blogs, total, limit, skip })
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
