import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all tables with their data
export async function GET(request: NextRequest) {
  try {
    // Get paginated table data with limits
    const [countries, cities, colleges, categories, exams, courses] = await Promise.all([
      db.country.findMany({ take: 50, orderBy: { name: 'asc' }, select: { id: true, name: true, slug: true, flagEmoji: true, active: true, _count: { select: { cities: true } } } }),
      db.city.findMany({ take: 50, orderBy: { name: 'asc' }, select: { id: true, name: true, slug: true, active: true, country: { select: { name: true } }, _count: { select: { colleges: true } } } }),
      db.college.findMany({ take: 50, orderBy: { name: 'asc' }, select: { id: true, name: true, slug: true, active: true, establishment_year: true, Countryranking: true, city: { select: { name: true } }, country: { select: { name: true } }, _count: { select: { categories: true, courses: true, exams: true } } } }),
      db.category.findMany({ take: 50, orderBy: { name: 'asc' }, select: { id: true, name: true, slug: true, active: true, _count: { select: { colleges: true } } } }),
      db.exam.findMany({ take: 50, orderBy: { name: 'asc' }, select: { id: true, name: true, slug: true, shortName: true, active: true, _count: { select: { colleges: true } } } }),
      db.course.findMany({ take: 50, orderBy: { name: 'asc' }, select: { id: true, name: true, slug: true, active: true, _count: { select: { colleges: true } } } }),
    ])

    // Get total counts separately (lightweight)
    const counts = {
      countries: await db.country.count(),
      cities: await db.city.count(),
      colleges: await db.college.count(),
      categories: await db.category.count(),
      exams: await db.exam.count(),
      courses: await db.course.count(),
    }

    return NextResponse.json({ countries, cities, colleges, categories, exams, courses, counts })
  } catch (error) {
    console.error('Error fetching tables:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tables' },
      { status: 500 }
    )
  }
}
