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

    // Single query: filter colleges directly by course name
    const colleges = await db.college.findMany({
      where: {
        courses: {
          some: {
            name: { equals: courseName, mode: 'insensitive' }
          }
        },
        active: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
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
          where: {
            name: { equals: courseName, mode: 'insensitive' }
          },
          select: {
            id: true,
            name: true,
            slug: true
          },
          take: 3
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

    return NextResponse.json(colleges, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    })
  } catch (error) {
    console.error('Error fetching colleges by course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch colleges' },
      { status: 500 }
    )
  }
}
