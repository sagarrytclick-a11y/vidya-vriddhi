import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { createPaginationParams, createPaginationResponse } from '@/lib/pagination-utils'
import { requireAdmin, activeContentFilter } from '@/lib/auth'
import { collegeBodySchema, formatZodIssues } from '@/lib/validations/college'

// GET all colleges with pagination
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

    const visibility = await activeContentFilter(request)
    const filteredWhere = { ...where, ...visibility }

    // Fetch colleges with pagination - only essential fields for list view
    const [colleges, total] = await Promise.all([
      db.college.findMany({
        where: filteredWhere,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          active: true,
          establishment_year: true,
          Countryranking: true,
          Internationalranking: true,
          logoURL: true,
          imageURL: true,
          createdAt: true,
          // Fetch related data in single query to avoid N+1
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
          // Use _count for relation counts instead of fetching all relations
          _count: {
            select: {
              categories: true,
              courses: true,
              exams: true
            }
          }
        }
      }),
      db.college.count({ where: filteredWhere })
    ])

    return NextResponse.json(createPaginationResponse(colleges, total, page, limit), {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch (error) {
    console.error('Error fetching colleges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch colleges' },
      { status: 500 }
    )
  }
}

// POST create college
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin(request)
    if (authError) return authError

    const body = await request.json()
    const validatedData = collegeBodySchema.parse(body)

    // Prepare create data with relations
    const createData: any = {
      name: validatedData.name,
      slug: validatedData.slug,
      description: validatedData.description,
      active: validatedData.active,
      countryId: validatedData.countryId,
      cityId: validatedData.cityId,
      establishment_year: validatedData.establishment_year,
      Countryranking: validatedData.Countryranking,
      Internationalranking: validatedData.Internationalranking,
      features: validatedData.features,
      imageURL: validatedData.imageURL,
      logoURL: validatedData.logoURL,
      keyHighlights: validatedData.keyHighlights,
      documentsRequired: validatedData.documentsRequired,
      feesStructure: validatedData.feesStructure,
      admissionProcess: validatedData.admissionProcess,
      whyChooseUs: validatedData.whyChooseUs,
      campusHighlights: validatedData.campusHighlights,
    }

    // Add relations to create data if provided
    if (validatedData.categories && validatedData.categories.length > 0) {
      createData.categories = {
        connect: validatedData.categories.map((id: string) => ({ id }))
      }
    }

    if (validatedData.exams && validatedData.exams.length > 0) {
      createData.exams = {
        connect: validatedData.exams.map((id: string) => ({ id }))
      }
    }

    if (validatedData.courses && validatedData.courses.length > 0) {
      createData.courses = {
        connect: validatedData.courses.map((id: string) => ({ id }))
      }
    }

    // Single create operation without transaction
    const college = await db.college.create({
      data: createData
    })

    // Fetch the complete college with relations
    const result = await db.college.findUnique({
      where: { id: college.id },
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
        _count: {
          select: {
            categories: true,
            courses: true,
            exams: true
          }
        }
      }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating college:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: formatZodIssues(error.issues) || 'Validation failed',
          issues: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create college', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
