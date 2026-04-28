import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createCourseSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  slug: z.string().min(1, 'Course slug is required'),
  description: z.string().optional(),
  active: z.boolean().default(false),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '1000')
    
    const courses = await db.course.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        colleges: {
          select: {
            id: true,
            name: true,
          }
        },
        _count: {
          select: {
            colleges: true
          }
        }
      }
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = createCourseSchema.parse(body)

    // Check if course with same name or slug already exists
    const existingCourse = await db.course.findFirst({
      where: {
        OR: [
          { name: validatedData.name },
          { slug: validatedData.slug }
        ]
      }
    })

    if (existingCourse) {
      return NextResponse.json(
        { error: 'Course with this name or slug already exists' },
        { status: 409 }
      )
    }

    const course = await db.course.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description || null,
        active: validatedData.active,
      },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}
