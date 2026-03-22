import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// Schema for college validation
const collegeSchema = z.object({
  name: z.string().min(1, 'College name is required'),
  slug: z.string().min(1, 'College slug is required'),
  description: z.string().optional(),
  active: z.boolean(),
  countryId: z.string().min(1, 'Country is required'),
  cityId: z.string().min(1, 'City is required'),
  establishment_year: z.number().optional(),
  Countryranking: z.number().optional(),
  Internationalranking: z.number().optional(),
  features: z.array(z.string()).default([]),
  imageURL: z.string().optional(),
  logoURL: z.string().optional(),
  keyHighlights: z.object({
    title: z.string(),
    description: z.string(),
    features: z.array(z.string())
  }).optional(),
  documentsRequired: z.object({
    title: z.string(),
    description: z.string(),
    documents: z.array(z.string())
  }).optional(),
  feesStructure: z.object({
    title: z.string(),
    description: z.string(),
    courses: z.array(z.object({
      course_name: z.string(),
      duration: z.string(),
      annual_tuition_fee: z.string()
    }))
  }).optional(),
  admissionProcess: z.object({
    title: z.string(),
    description: z.string(),
    steps: z.array(z.string())
  }).optional(),
  whyChooseUs: z.object({
    title: z.string(),
    description: z.string(),
    features: z.array(z.object({
      title: z.string(),
      description: z.string()
    }))
  }).optional(),
  campusHighlights: z.object({
    title: z.string(),
    description: z.string(),
    highlights: z.array(z.string())
  }).optional(),
  categories: z.union([
    z.array(z.string()),
    z.array(z.object({ id: z.string() }))
  ]).optional(),
  exams: z.union([
    z.array(z.string()),
    z.array(z.object({ id: z.string() }))
  ]).optional(),
  courses: z.union([
    z.array(z.string()),
    z.array(z.object({ id: z.string() }))
  ]).optional()
})

// GET college by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const college = await db.college.findUnique({
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
        features: true,
        logoURL: true,
        imageURL: true,
        keyHighlights: true,
        whyChooseUs: true,
        documentsRequired: true,
        feesStructure: true,
        admissionProcess: true,
        campusHighlights: true,
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
    const { id } = await params
    const body = await request.json()
    const validatedData = collegeSchema.parse(body)

    // Use transaction for better performance and data consistency
    const result = await db.$transaction(async (tx) => {
      // Update college basic info first
      const college = await tx.college.update({
        where: { id },
        data: {
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
      })

      // Update relations only if they exist in the request
      if (validatedData.categories !== undefined) {
        await tx.college.update({
          where: { id },
          data: {
            categories: validatedData.categories.length > 0 ? {
              set: validatedData.categories.map((item: string | { id: string }) => 
                typeof item === 'string' ? { id: item } : item
              )
            } : {
              set: []
            }
          }
        })
      }

      if (validatedData.exams !== undefined) {
        await tx.college.update({
          where: { id },
          data: {
            exams: validatedData.exams.length > 0 ? {
              set: validatedData.exams.map((item: string | { id: string }) => 
                typeof item === 'string' ? { id: item } : item
              )
            } : {
              set: []
            }
          }
        })
      }

      if (validatedData.courses !== undefined) {
        await tx.college.update({
          where: { id },
          data: {
            courses: validatedData.courses.length > 0 ? {
              set: validatedData.courses.map((item: string | { id: string }) => 
                typeof item === 'string' ? { id: item } : item
              )
            } : {
              set: []
            }
          }
        })
      }

      // Fetch the updated college with optimized select
      return await tx.college.findUnique({
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
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating college:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.issues },
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
