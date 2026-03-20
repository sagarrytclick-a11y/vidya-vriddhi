import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createNewsSchema = z.object({
  title: z.string().min(1, 'News title is required'),
  slug: z.string().min(1, 'News slug is required'),
  content: z.string().min(1, 'News content is required'),
  imageUrl: z.string().url().optional(),
  active: z.boolean().default(false),
})

export async function GET() {
  try {
    const news = await db.news.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(news)
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
