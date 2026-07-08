import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendMBBSLeadEmail } from '@/lib/mbbs-email'

const mbbsLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be a valid 10-digit number'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  neetScore: z.string().optional(),
  category: z.string().min(2, 'Category is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = mbbsLeadSchema.parse(body)

    const emailResult = await sendMBBSLeadEmail({
      ...validatedData,
      neetScore: validatedData.neetScore || 'Not provided',
    })

    if (!emailResult.success) {
      console.error('MBBS lead email notification failed:', emailResult.error)
    }

    return NextResponse.json({
      success: true,
      message: 'Your MBBS enquiry has been submitted successfully!',
    }, { status: 201 })

  } catch (error) {
    console.error('Error processing MBBS lead:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.issues.map(i => ({ field: i.path.join('.'), message: i.message })),
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to submit enquiry. Please try again.',
    }, { status: 500 })
  }
}
