import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

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

// GET single exam
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const exam = await db.exam.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        shortName: true,
        description: true,
        conductingBody: true,
        examType: true,
        examMode: true,
        frequency: true,
        active: true,
        examImageurl: true,
        overview: true,
        registration: true,
        examPattern: true,
        examDates: true,
        resultStatistics: true,
        createdAt: true,
        updatedAt: true,
        colleges: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoURL: true,
          },
          take: 20,
        },
      },
    })

    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(exam)
  } catch (error) {
    console.error('Error fetching exam:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exam' },
      { status: 500 }
    )
  }
}

// PUT update exam
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const body = await request.json()

    // First check if exam exists
    const existingExam = await db.exam.findUnique({
      where: { id }
    })

    if (!existingExam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      )
    }

    // Validate only the fields that are provided
    const validatedData = examSchema.parse(body)

    const exam = await db.exam.update({
      where: { id },
      data: validatedData
    })

    return NextResponse.json(exam)
  } catch (error) {
    console.error('Error updating exam:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update exam' },
      { status: 500 }
    )
  }
}

// DELETE exam
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // First check if exam exists
    const existingExam = await db.exam.findUnique({
      where: { id }
    })

    if (!existingExam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      )
    }

    await db.exam.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Exam deleted successfully' })
  } catch (error) {
    console.error('Error deleting exam:', error)
    return NextResponse.json(
      { error: 'Failed to delete exam' },
      { status: 500 }
    )
  }
}
