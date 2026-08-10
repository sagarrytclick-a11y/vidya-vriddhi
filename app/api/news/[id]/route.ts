import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { requireAdmin, activeContentFilter } from '@/lib/auth'

const updateNewsSchema = z.object({
  title: z.string().min(1, 'News title is required').optional(),
  slug: z.string().min(1, 'News slug is required').optional(),
  content: z.string().min(1, 'News content is required').optional(),
  imageUrl: z.string().url().optional(),
  active: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const news = await db.news.findFirst({
      where: {
        id,
        ...activeContentFilter(request),
      },
    })

    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(news)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
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
    const validatedData = updateNewsSchema.parse(body)

    if (!validatedData.title || !validatedData.slug || !validatedData.content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      )
    }

    // Check if news with same title or slug already exists (excluding current news)
    const existingNews = await db.news.findFirst({
      where: {
        OR: [
          { title: validatedData.title },
          { slug: validatedData.slug }
        ],
        NOT: {
          id
        }
      }
    })

    if (existingNews) {
      return NextResponse.json(
        { error: 'News with this title or slug already exists' },
        { status: 409 }
      )
    }

    const news = await db.news.update({
      where: {
        id
      },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        content: validatedData.content,
        imageUrl: validatedData.imageUrl,
        active: validatedData.active
      }
    })

    return NextResponse.json(news)
  } catch (error) {
    console.error('Error updating news:', error)
    return NextResponse.json(
      { error: 'Failed to update news' },
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

    await db.news.delete({
      where: {
        id
      }
    })

    return NextResponse.json({ message: 'News deleted successfully' })
  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    )
  }
}
