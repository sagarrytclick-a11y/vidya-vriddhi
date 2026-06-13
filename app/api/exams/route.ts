import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { createPaginationParams, createPaginationResponse } from '@/lib/pagination-utils'

// Schema for exam validation
const examSchema = z.object({
  name: z.string().min(1, 'Exam name is required'),
  slug: z.string().min(1, 'Exam slug is required'),
  shortName: z.string().min(1, 'Short name is required'),
  description: z.string().min(1, 'Description is required'),
  conductingBody: z.string().min(1, 'Conducting body is required'),
  examType: z.enum(['NATIONAL', 'STATE', 'UNIVERSITY', 'INTERNATIONAL']),
  examMode: z.enum(['ONLINE', 'OFFLINE', 'HYBRID']),
  frequency: z.enum(['ONCE_A_YEAR', 'TWICE_A_YEAR', 'QUARTERLY', 'MONTHLY']),
  active: z.boolean(),
  examImageurl: z.string().optional(),
  overview: z.object({
    title: z.string(),
    content: z.string(),
    keyHighlights: z.array(z.string())
  }),
  registration: z.object({
    title: z.string(),
    description: z.string(),
    bulletPoints: z.array(z.string())
  }),
  examPattern: z.object({
    title: z.string(),
    description: z.string(),
    totalDurationMins: z.number(),
    scoreRange: z.string(),
    tableData: z.array(z.object({
      section: z.string(),
      questions: z.number(),
      durationMins: z.number()
    }))
  }),
  examDates: z.object({
    title: z.string(),
    importantDates: z.array(z.object({
      event: z.string(),
      date: z.string()
    }))
  }),
  resultStatistics: z.object({
    title: z.string(),
    description: z.string(),
    passingCriteria: z.string(),
    totalMarks: z.number()
  })
})

// GET all exams with pagination
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
            { shortName: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {}

    // Fetch exams with pagination
    const [exams, total] = await Promise.all([
      db.exam.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          shortName: true,
          description: true,
          conductingBody: true,
          examMode: true,
          examType: true,
          frequency: true,
          active: true,
          examImageurl: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      db.exam.count({ where })
    ])

    return NextResponse.json(createPaginationResponse(exams, total, page, limit))
  } catch (error) {
    console.error('Error fetching exams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exams' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = examSchema.parse(body)

    const exam = await db.exam.create({
      data: validatedData
    })

    return NextResponse.json(exam, { status: 201 })
  } catch (error) {
    console.error('Error creating exam:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create exam' },
      { status: 500 }
    )
  }
}
