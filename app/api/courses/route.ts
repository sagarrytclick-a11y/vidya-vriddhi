import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { createPaginationParams, createPaginationResponse } from '@/lib/pagination-utils'

const createCourseSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  slug: z.string().min(1, 'Course slug is required'),
  description: z.string().optional(),
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
            { name: { contains: search, mode: 'insensitive' as const } },
            { slug: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {}

    // Fetch courses with pagination
    const [courses, total] = await Promise.all([
      db.course.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          active: true,
          createdAt: true,
          updatedAt: true,
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
      }),
      db.course.count({ where })
    ])

    return NextResponse.json(createPaginationResponse(courses, total, page, limit), {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    })
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
