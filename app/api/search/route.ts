import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    // Search all entities in parallel
    const [colleges, exams, news, courses] = await Promise.all([
      // Search colleges
      db.college.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { slug: { contains: query, mode: 'insensitive' as const } }
          ]
        },
        take: limit,
        include: {
          country: {
            select: {
              name: true,
              flagEmoji: true
            }
          }
        }
      }),

      // Search exams
      db.exam.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { slug: { contains: query, mode: 'insensitive' as const } }
          ]
        },
        take: limit
      }),

      // Search news/articles
      db.news.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' as const } },
            { content: { contains: query, mode: 'insensitive' as const } }
          ]
        },
        take: limit
      }),

      // Search courses
      db.course.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { slug: { contains: query, mode: 'insensitive' as const } }
          ]
        },
        take: limit
      })
    ])

    // Format results with type
    const results = [
      ...colleges.map(college => ({
        id: college.id,
        name: college.name,
        type: 'College',
        image: college.logoURL || college.imageURL,
        slug: college.slug,
        additionalInfo: college.country.name,
        flag: college.country.flagEmoji
      })),
      ...exams.map(exam => ({
        id: exam.id,
        name: exam.name,
        type: 'Exam',
        image: exam.examImageurl,
        slug: exam.slug,
        additionalInfo: exam.examDates && typeof exam.examDates === 'string' ? new Date(exam.examDates).toLocaleDateString() : 'TBA'
      })),
      ...news.map(newsItem => ({
        id: newsItem.id,
        name: newsItem.title,
        type: 'News',
        image: newsItem.imageUrl,
        slug: newsItem.slug,
        additionalInfo: new Date(newsItem.createdAt).toLocaleDateString()
      })),
      ...courses.map(course => ({
        id: course.id,
        name: course.name,
        type: 'Course',
        image: null,
        slug: course.slug,
        additionalInfo: 'Course'
      }))
    ]

    return NextResponse.json({ results }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch (error) {
    console.error('Error searching:', error)
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    )
  }
}
