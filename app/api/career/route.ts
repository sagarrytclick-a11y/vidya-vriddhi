import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireCanViewLeads } from '@/lib/auth'
import { enforceRateLimit } from '@/lib/rate-limit'
import { detectPdf } from '@/lib/file-magic'
import { getImageKit } from '@/lib/imagekit'

const careerApplicationSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(200).trim().toLowerCase(),
  phone: z
    .string()
    .min(7)
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number'),
  position: z.string().min(2).max(150).trim(),
})

function publicResumePath(id: string) {
  return `/api/career/${id}/resume`
}

export async function POST(request: NextRequest) {
  try {
    const ipLimited = await enforceRateLimit(request, 'career', 5, 60_000)
    if (ipLimited) return ipLimited

    const formData = await request.formData()
    const parsed = careerApplicationSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      position: formData.get('position'),
    })

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 }
      )
    }

    const { name, email, phone, position } = parsed.data

    const emailLimited = await enforceRateLimit(request, {
      scope: 'career-email',
      limit: 3,
      windowMs: 60 * 60_000,
      identityKeys: [`email:${email}`],
    })
    if (emailLimited) return emailLimited
    const resume = formData.get('resume') as File | null

    if (!resume || resume.size === 0) {
      return NextResponse.json({ error: 'Resume PDF is required' }, { status: 400 })
    }

    if (resume.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
    }

    const bytes = await resume.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const pdfCheck = detectPdf(buffer)
    if (!pdfCheck.ok) {
      return NextResponse.json({ error: pdfCheck.error }, { status: 400 })
    }

    const safeName = name.replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 40)
    const uniqueFilename = `resume-${safeName}-${randomUUID()}.pdf`

    // Private file — not publicly listable/guessable on CDN (ImageKit free tier)
    const uploadResponse = await getImageKit().upload({
      file: buffer,
      fileName: uniqueFilename,
      folder: '/career-resumes',
      useUniqueFileName: false,
      isPrivateFile: true,
      tags: ['resume', 'career', 'vidya-vridhi'],
    })

    const application = await db.careerApplication.create({
      data: {
        name,
        email,
        phone,
        position,
        resumeUrl: uploadResponse.filePath,
        resumeFileId: uploadResponse.fileId,
      },
    })

    return NextResponse.json({ success: true, id: application.id })
  } catch (error) {
    console.error('Career application error:', error)
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 })
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
    const position = searchParams.get('position')

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (position) {
      where.position = position
    }

    const [total, rows] = await Promise.all([
      db.careerApplication.count({ where }),
      db.careerApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          position: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ])

    // Never leak ImageKit paths — admin UI uses auth-only proxy
    const applications = rows.map((app) => ({
      ...app,
      resumeUrl: publicResumePath(app.id),
    }))

    return NextResponse.json({
      applications,
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
    console.error('Error fetching career applications:', error)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}
