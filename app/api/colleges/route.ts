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
  categories: z.array(z.string()).optional(),
  exams: z.array(z.string()).optional(),
  courses: z.array(z.string()).optional()
})

// GET all colleges
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    
    // For list view, fetch only essential data
    const colleges = await db.college.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } }
        ]
      },
      orderBy: { createdAt: 'desc' },
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

    return NextResponse.json(colleges)
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
    const body = await request.json()
    const validatedData = collegeSchema.parse(body)

    // Use transaction for better performance and data consistency
    const result = await db.$transaction(async (tx) => {
      // Create college without relations first
      const college = await tx.college.create({
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

      // Add relations if provided
      if (validatedData.categories && validatedData.categories.length > 0) {
        await tx.college.update({
          where: { id: college.id },
          data: {
            categories: {
              connect: validatedData.categories.map((id: string) => ({ id }))
            }
          }
        })
      }

      if (validatedData.exams && validatedData.exams.length > 0) {
        await tx.college.update({
          where: { id: college.id },
          data: {
            exams: {
              connect: validatedData.exams.map((id: string) => ({ id }))
            }
          }
        })
      }

      if (validatedData.courses && validatedData.courses.length > 0) {
        await tx.college.update({
          where: { id: college.id },
          data: {
            courses: {
              connect: validatedData.courses.map((id: string) => ({ id }))
            }
          }
        })
      }

      // Fetch the complete college with relations
      return await tx.college.findUnique({
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
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating college:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create college', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
