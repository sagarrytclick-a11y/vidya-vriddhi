import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendMBBSLeadEmail } from '@/lib/mbbs-email'
import { enforceRateLimit } from '@/lib/rate-limit'

const mbbsLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email: z.string().email('Please enter a valid email').max(200).trim().toLowerCase(),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be a valid 10-digit number'),
  city: z.string().min(2, 'City is required').max(100).trim(),
  state: z.string().min(2, 'State is required').max(100).trim(),
  neetScore: z.string().max(20).optional(),
  category: z.string().min(2, 'Category is required').max(100).trim(),
})

export async function POST(request: NextRequest) {
  try {
    const ipLimited = enforceRateLimit(request, 'mbbs-lead', 5, 60_000)
    if (ipLimited) return ipLimited

    const body = await request.json()
    const validatedData = mbbsLeadSchema.parse(body)

    const emailLimited = enforceRateLimit(request, {
      scope: 'mbbs-lead-email',
      limit: 5,
      windowMs: 60 * 60_000,
      identityKeys: [`email:${validatedData.email}`],
    })
    if (emailLimited) return emailLimited

    const emailResult = await sendMBBSLeadEmail({
      ...validatedData,
      neetScore: validatedData.neetScore || 'Not provided',
    })

    if (!emailResult.success) {
      console.error('MBBS lead email notification failed:', emailResult.error)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your MBBS enquiry has been submitted successfully!',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing MBBS lead:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit enquiry. Please try again.',
      },
      { status: 500 }
    )
  }
}
