import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'

const updateCourseSchema = z.object({
  name: z.string().min(1, 'Course name is required').optional(),
  slug: z.string().min(1, 'Course slug is required').optional(),
  description: z.string().optional(),
  active: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const course = await db.course.findUnique({
      where: {
        id
      },
      include: {
        colleges: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
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
    const validatedData = updateCourseSchema.parse(body)

    if (!validatedData.name || !validatedData.slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if course with same name or slug already exists (excluding current course)
    const existingCourse = await db.course.findFirst({
      where: {
        OR: [
          { name: validatedData.name },
          { slug: validatedData.slug }
        ],
        NOT: {
          id
        }
      }
    })

    if (existingCourse) {
      return NextResponse.json(
        { error: 'Course with this name or slug already exists' },
        { status: 409 }
      )
    }

    const course = await db.course.update({
      where: {
        id
      },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        active: validatedData.active
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { error: 'Failed to update course' },
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

    // Check if course has associated colleges
    const collegesCount = await db.college.count({
      where: {
        courses: {
          some: {
            id
          }
        }
      }
    })

    if (collegesCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete course with associated colleges' },
        { status: 409 }
      )
    }

    await db.course.delete({
      where: {
        id
      }
    })

    return NextResponse.json({ message: 'Course deleted successfully' })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    )
  }
}
