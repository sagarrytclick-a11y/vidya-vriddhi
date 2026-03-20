import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateBlogSchema = z.object({
  title: z.string().min(1, 'Blog title is required').optional(),
  slug: z.string().min(1, 'Blog slug is required').optional(),
  content: z.string().min(1, 'Blog content is required').optional(),
  imageUrl: z.string().url().optional(),
  active: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const blog = await db.blog.findUnique({
      where: {
        id
      }
    })

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateBlogSchema.parse(body)

    if (!validatedData.title || !validatedData.slug || !validatedData.content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      )
    }

    // Check if blog with same title or slug already exists (excluding current blog)
    const existingBlog = await db.blog.findFirst({
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

    if (existingBlog) {
      return NextResponse.json(
        { error: 'Blog with this title or slug already exists' },
        { status: 409 }
      )
    }

    const blog = await db.blog.update({
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

    return NextResponse.json(blog)
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await db.blog.delete({
      where: {
        id
      }
    })

    return NextResponse.json({ message: 'Blog deleted successfully' })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}
