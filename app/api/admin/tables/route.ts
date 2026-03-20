import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all tables with their data
export async function GET(request: NextRequest) {
  try {
    // Get all tables data
    const countries = await db.country.findMany({
      include: {
        cities: true
      }
    })
    
    const cities = await db.city.findMany({
      include: {
        country: true
      }
    })
    
    const colleges = await db.college.findMany({
      include: {
        city: true,
        country: true,
        categories: true,
        exams: true
      }
    })
    
    const categories = await db.category.findMany({
      include: {
        colleges: true
      }
    })
    
    const exams = await db.exam.findMany({
      include: {
        colleges: true
      }
    })
    
    const courses = await db.course.findMany({
      include: {
        colleges: true
      }
    })

    return NextResponse.json({
      countries: countries,
      cities: cities,
      colleges: colleges,
      categories: categories,
      exams: exams,
      courses: courses,
      counts: {
        countries: countries.length,
        cities: cities.length,
        colleges: colleges.length,
        categories: categories.length,
        exams: exams.length,
        courses: courses.length
      }
    })
  } catch (error) {
    console.error('Error fetching tables:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tables' },
      { status: 500 }
    )
  }
}
