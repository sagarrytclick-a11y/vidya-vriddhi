import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireCanViewLeads } from '@/lib/auth'
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

/** Public: create service lead (also emails via Resend) */
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

    await db.serviceEnquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      },
    })

    const { sendServiceEnquiryEmail } = await import('@/lib/email')
    const emailResult = await sendServiceEnquiryEmail(data)
    if (!emailResult.success) {
      console.error('Service enquiry email failed:', emailResult.error)
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

/** Admin: list service leads with pagination */
export async function GET(request: NextRequest) {
  try {
    const authError = await requireCanViewLeads(request)
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10) || 10))
    const search = searchParams.get('search')?.trim() || ''
    const status = searchParams.get('status')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status && ['PENDING', 'RESOLVED', 'FOLLOW_UP'].includes(status)) {
      where.status = status
    }

    const [total, leads] = await Promise.all([
      db.serviceEnquiry.count({ where }),
      db.serviceEnquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ])

    const totalPages = Math.ceil(total / limit) || 0

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Error fetching service enquiries:', error)
    return NextResponse.json({ error: 'Failed to fetch service enquiries' }, { status: 500 })
  }
}
