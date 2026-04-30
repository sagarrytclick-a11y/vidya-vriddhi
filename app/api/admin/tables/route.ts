import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all tables with their data
export async function GET(request: NextRequest) {
  try {
    // Get all tables data in parallel with selective fields
    const [countries, cities, colleges, categories, exams, courses] = await Promise.all([
      db.country.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          flagEmoji: true,
          description: true,
          active: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { cities: true }
          }
        }
      }),

      db.city.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          cityImageURL: true,
          features: true,
          active: true,
          countryId: true,
          createdAt: true,
          updatedAt: true,
          country: {
            select: {
              id: true,
              name: true,
              slug: true,
              flagEmoji: true
            }
          },
          _count: {
            select: { colleges: true }
          }
        }
      }),

      db.college.findMany({
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
          countryId: true,
          cityId: true,
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
          _count: {
            select: {
              categories: true,
              courses: true,
              exams: true
            }
          }
        }
      }),

      db.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          active: true,
          categoryImageUrl: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { colleges: true }
          }
        }
      }),

      db.exam.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          shortName: true,
          description: true,
          active: true,
          conductingBody: true,
          frequency: true,
          examMode: true,
          examType: true,
          examImageurl: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { colleges: true }
          }
        }
      }),

      db.course.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          active: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { colleges: true }
          }
        }
      })
    ])

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
