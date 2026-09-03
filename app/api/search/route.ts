import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function buildWordFilters(query: string, field: string) {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 0)

  if (words.length === 0) return undefined

  return words.map((word) => ({
    [field]: { contains: word, mode: 'insensitive' as const },
  }))
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = (searchParams.get('q') || '').trim()
    const limit = Math.min(
      Math.max(parseInt(searchParams.get('limit') || '10', 10) || 10, 1),
      20
    )

    if (!query || query.length > 100) {
      return NextResponse.json({ results: [] })
    }

    const nameFilters = buildWordFilters(query, 'name')
    const titleFilters = buildWordFilters(query, 'title')

    const [colleges, exams, news, courses] = await Promise.all([
      db.college.findMany({
        where: {
          active: true,
          AND: nameFilters,
        },
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          logoURL: true,
          imageURL: true,
          city: { select: { name: true } },
          country: { select: { name: true, flagEmoji: true } },
        },
      }),

      db.exam.findMany({
        where: {
          active: true,
          AND: nameFilters,
        },
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          examImageurl: true,
        },
      }),

      db.news.findMany({
        where: {
          active: true,
          AND: titleFilters,
        },
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          imageUrl: true,
          createdAt: true,
        },
      }),

      db.course.findMany({
        where: {
          active: true,
          AND: nameFilters,
        },
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),
    ])

    const lowerQuery = query.toLowerCase()

    function relevanceScore(name: string): number {
      const lower = name.toLowerCase()
      if (lower === lowerQuery) return 100
      if (lower.startsWith(lowerQuery)) return 80
      if (lower.includes(lowerQuery)) return 60
      return 40
    }

    const results = [
      ...colleges.map((college) => ({
        id: college.id,
        name: college.name,
        type: 'College' as const,
        image: college.logoURL || college.imageURL,
        slug: college.slug,
        additionalInfo: [college.city?.name, college.country?.name]
          .filter(Boolean)
          .join(', '),
        flag: college.country?.flagEmoji ?? null,
        _score: relevanceScore(college.name),
      })),
      ...exams.map((exam) => ({
        id: exam.id,
        name: exam.name,
        type: 'Exam' as const,
        image: exam.examImageurl,
        slug: exam.slug,
        additionalInfo: 'Entrance Exam',
        flag: null,
        _score: relevanceScore(exam.name),
      })),
      ...news.map((n) => ({
        id: n.id,
        name: n.title,
        type: 'News' as const,
        image: n.imageUrl,
        slug: n.slug,
        additionalInfo: new Date(n.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        flag: null,
        _score: relevanceScore(n.title),
      })),
      ...courses.map((course) => ({
        id: course.id,
        name: course.name,
        type: 'Course' as const,
        image: null,
        slug: course.slug,
        additionalInfo: 'Course / Program',
        flag: null,
        _score: relevanceScore(course.name),
      })),
    ]
      .sort((a, b) => b._score - a._score)
      .slice(0, limit)
      .map(({ _score, ...rest }) => rest)

    return NextResponse.json(
      { results },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    console.error('Error searching:', error)
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    )
  }
}
