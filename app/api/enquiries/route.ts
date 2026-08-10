import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { sendEnquiryEmail } from '@/lib/email'
import { requireCanViewLeads } from '@/lib/auth'
import { enforceRateLimit } from '@/lib/rate-limit'

const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email: z.string().email('Please enter a valid email').max(200).trim().toLowerCase(),
  phone: z
    .string()
    .max(20)
    .regex(/^[0-9+\-\s()]*$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  city: z.string().max(100).trim().optional().or(z.literal('')),
  category: z.string().max(100).trim().optional().or(z.literal('')),
})

export async function POST(request: NextRequest) {
  try {
    const ipLimited = await enforceRateLimit(request, 'enquiry', 8, 60_000)
    if (ipLimited) return ipLimited

    const body = await request.json()
    const validatedData = enquirySchema.parse(body)

    const emailLimited = await enforceRateLimit(request, {
      scope: 'enquiry-email',
      limit: 5,
      windowMs: 60 * 60_000,
      identityKeys: [`email:${validatedData.email}`],
    })
    if (emailLimited) return emailLimited

    await db.enquiry.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        city: validatedData.city || null,
        category: validatedData.category || null,
      },
    })

    const emailResult = await sendEnquiryEmail({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone || undefined,
      city: validatedData.city || undefined,
      category: validatedData.category || undefined,
    })

    if (!emailResult.success) {
      console.error('Email notification failed:', emailResult.error)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Enquiry submitted successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating enquiry:', error)

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
        error: 'Failed to submit enquiry',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const authError = await requireCanViewLeads(request)
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    const [total, enquiries] = await Promise.all([
      db.enquiry.count({ where }),
      db.enquiry.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
    ])

    return NextResponse.json({
      enquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Error fetching enquiries:', error)
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 })
  }
}
