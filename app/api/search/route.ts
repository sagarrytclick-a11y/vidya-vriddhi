import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10', 10) || 10, 1), 20)

    if (!query || query.length > 100) {
      return NextResponse.json({ results: [] })
    }

    // Search all entities in parallel — select only fields used in results
    const [colleges, exams, news, courses] = await Promise.all([
      db.college.findMany({
        where: {
          active: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { slug: { contains: query, mode: 'insensitive' as const } }
          ]
        },
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          logoURL: true,
          imageURL: true,
          country: {
            select: {
              name: true,
              flagEmoji: true
            }
          }
        }
      }),

      db.exam.findMany({
        where: {
          active: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { slug: { contains: query, mode: 'insensitive' as const } }
          ]
        },
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          examImageurl: true,
        }
      }),

      db.news.findMany({
        where: {
          active: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' as const } },
            { slug: { contains: query, mode: 'insensitive' as const } }
          ]
        },
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          imageUrl: true,
          createdAt: true,
        }
      }),

      db.course.findMany({
        where: {
          active: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { slug: { contains: query, mode: 'insensitive' as const } }
          ]
        },
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
        }
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
        additionalInfo: 'Exam'
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
