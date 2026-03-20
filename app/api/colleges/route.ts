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
    
    const colleges = await db.college.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        city: true,
        country: true,
        categories: true,
        courses: true,
        exams: true
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

    const college = await db.college.create({
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
        categories: validatedData.categories ? {
          connect: validatedData.categories.map((id: string) => ({ id }))
        } : undefined,
        exams: validatedData.exams ? {
          connect: validatedData.exams.map((id: string) => ({ id }))
        } : undefined,
        courses: validatedData.courses ? {
          connect: validatedData.courses.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        city: true,
        country: true,
        categories: true,
        courses: true,
        exams: true
      }
    })

    return NextResponse.json(college, { status: 201 })
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
