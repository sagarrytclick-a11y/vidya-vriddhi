import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { enforceRateLimit } from '@/lib/rate-limit'

const serviceEnquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email: z.string().email('Please enter a valid email').max(200).trim().toLowerCase(),
  phone: z
    .string()
    .min(10, 'Enter a valid phone number')
    .max(15, 'Enter a valid phone number')
    .regex(/^[0-9+\-\s()]+$/, 'Enter a valid phone number')
    .trim(),
  message: z.string().min(5, 'Message must be at least 5 characters').max(1000).trim(),
})

export async function POST(request: NextRequest) {
  try {
    const ipLimited = await enforceRateLimit(request, 'service-enquiry', 5, 60_000)
    if (ipLimited) return ipLimited

    const body = await request.json()
    const data = serviceEnquirySchema.parse(body)

    const emailLimited = await enforceRateLimit(request, {
      scope: 'service-enquiry-email',
      limit: 5,
      windowMs: 60 * 60_000,
      identityKeys: [`email:${data.email}`],
    })
    if (emailLimited) return emailLimited

    const { sendServiceEnquiryEmail } = await import('@/lib/email')
    const emailResult = await sendServiceEnquiryEmail(data)

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: emailResult.error || 'Failed to send enquiry. Please try again.',
        },
        { status: 503 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Thanks! We received your enquiry and will contact you soon.',
    })
  } catch (error) {
    console.error('Error processing service enquiry:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.issues[0]?.message || 'Validation failed',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to submit enquiry. Please try again.' },
      { status: 500 }
    )
  }
}
