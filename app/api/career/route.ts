import { NextRequest, NextResponse } from 'next/server'
import ImageKit from 'imagekit'
import { randomUUID } from 'crypto'
import { db } from '@/lib/db'

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const position = formData.get('position') as string
    const resume = formData.get('resume') as File | null

    if (!name || !email || !phone || !position) {
      return NextResponse.json({ error: 'Name, email, phone, and position are required' }, { status: 400 })
    }

    if (!resume || resume.size === 0) {
      return NextResponse.json({ error: 'Resume PDF is required' }, { status: 400 })
    }

    if (resume.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }

    if (resume.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
    }

    const bytes = await resume.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uniqueFilename = `resume-${name.replace(/\s+/g, '-')}-${randomUUID()}.pdf`

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: uniqueFilename,
      folder: '/career-resumes',
      useUniqueFileName: false,
      tags: ['resume', 'career', 'vidya-vridhi'],
    })

    const application = await db.careerApplication.create({
      data: {
        name,
        email,
        phone,
        position,
        resumeUrl: uploadResponse.url,
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
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const position = searchParams.get('position')

    const skip = (page - 1) * limit

    const where: any = {}

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

    const [total, applications] = await Promise.all([
      db.careerApplication.count({ where }),
      db.careerApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ])

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
