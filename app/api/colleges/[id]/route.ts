import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { requireAdmin, activeContentFilter, requireCanDelete } from '@/lib/auth'
import { collegeBodySchema, formatZodIssues } from '@/lib/validations/college'

// GET college by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const college = await db.college.findFirst({
      where: { id, ...await activeContentFilter(request) },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        active: true,
        establishment_year: true,
        Countryranking: true,
        Internationalranking: true,
        features: true,
        logoURL: true,
        imageURL: true,
        keyHighlights: true,
        whyChooseUs: true,
        documentsRequired: true,
        feesStructure: true,
        admissionProcess: true,
        campusHighlights: true,
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
        categories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        courses: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        exams: {
          select: {
            id: true,
            name: true,
            slug: true,
            shortName: true
          }
        }
      }
    })

    if (!college) {
      return NextResponse.json(
        { error: 'College not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(college)
  } catch (error) {
    console.error('Error fetching college:', error)
    return NextResponse.json(
      { error: 'Failed to fetch college' },
      { status: 500 }
    )
  }
}

// PUT update college
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdmin(request)
    if (authError) return authError

    const { id } = await params
    const body = await request.json()
    const validatedData = collegeBodySchema.parse(body)

    // Prepare update data with relations
    const updateData: any = {
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

    // Add relations to update data only if they exist in the request
    if (validatedData.categories !== undefined) {
      updateData.categories = {
        set: validatedData.categories.map((id) => ({ id })),
      }
    }

    if (validatedData.exams !== undefined) {
      updateData.exams = {
        set: validatedData.exams.map((id) => ({ id })),
      }
    }

    if (validatedData.courses !== undefined) {
      updateData.courses = {
        set: validatedData.courses.map((id) => ({ id })),
      }
    }

    // Single update operation without transaction
    const college = await db.college.update({
      where: { id },
      data: updateData
    })

    // Fetch the updated college with optimized select
    const result = await db.college.findUnique({
      where: { id },
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

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating college:', error)
    
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
      { error: 'Failed to update college' },
      { status: 500 }
    )
  }
}

// DELETE college
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireCanDelete(request)
    if (authError) return authError

    const { id } = await params
    
    // Check if college exists
    const existingCollege = await db.college.findUnique({
      where: { id }
    })

    if (!existingCollege) {
      return NextResponse.json(
        { error: 'College not found' },
        { status: 404 }
      )
    }

    await db.college.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'College deleted successfully' })
  } catch (error) {
    console.error('Error deleting college:', error)
    return NextResponse.json(
      { error: 'Failed to delete college' },
      { status: 500 }
    )
  }
}
