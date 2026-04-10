import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET colleges filtered by course
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseName = searchParams.get('course') || ''
    
    if (!courseName) {
      return NextResponse.json(
        { error: 'Course parameter is required' },
        { status: 400 }
      )
    }

    // Find the course by name
    const course = await db.course.findFirst({
      where: { 
        name: {
          equals: courseName,
          mode: 'insensitive'
        }
      }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Fetch colleges that offer this course
    const colleges = await db.college.findMany({
      where: {
        courses: {
          some: {
            id: course.id
          }
        },
        active: true
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        active: true,
        establishment_year: true,
        Countryranking: true,
        Internationalranking: true,
        logoURL: true,
        imageURL: true,
        createdAt: true,
        updatedAt: true,
        city: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        country: {
          select: {
            id: true,
            name: true,
            slug: true,
            flagEmoji: true
          }
        },
        courses: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            categories: true,
            courses: true,
            exams: true
          }
        }
      }
    })

    return NextResponse.json(colleges)
  } catch (error) {
    console.error('Error fetching colleges by course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch colleges' },
      { status: 500 }
    )
  }
}
