import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { get, set } from '@/lib/cache'

export async function GET() {
  try {
    const cacheKey = 'filters-data'
    const cached = get<{ categories: any[]; courses: any[]; cities: any[]; exams: any[] }>(cacheKey)
    if (cached) {
      return NextResponse.json(cached, {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
      })
    }

    const [categories, courses, cities, exams] = await Promise.all([
      db.category.findMany({ where: { active: true }, select: { id: true, name: true, slug: true }, orderBy: { name: 'asc' } }),
      db.course.findMany({ where: { active: true }, select: { id: true, name: true, slug: true }, orderBy: { name: 'asc' } }),
      db.city.findMany({ where: { active: true }, select: { id: true, name: true, slug: true }, orderBy: { name: 'asc' } }),
      db.exam.findMany({ where: { active: true }, select: { id: true, name: true, slug: true }, orderBy: { name: 'asc' } }),
    ])

    const data = { categories, courses, cities, exams }
    set(cacheKey, data)

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    })
  } catch (error) {
    console.error('Error fetching filters:', error)
    return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 })
  }
}
