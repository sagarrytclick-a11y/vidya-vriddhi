import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getEnvAdminAccounts, requireSuperAdmin } from '@/lib/auth'
import { hashPassword } from '@/lib/password'

const createStaffSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(50)
    .regex(/^[a-zA-Z0-9._-]+$/, 'Username can only contain letters, numbers, . _ -'),
  password: z.string().min(12, 'Password must be at least 12 characters').max(200),
  role: z.enum(['admin', 'content_writer']),
})

function isReservedEnvUsername(username: string): boolean {
  const lower = username.toLowerCase()
  return getEnvAdminAccounts().some((account) => account.username.toLowerCase() === lower)
}

export async function GET(request: NextRequest) {
  try {
    const forbidden = await requireSuperAdmin(request)
    if (forbidden) return forbidden

    const staff = await db.adminStaff.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ staff })
  } catch (error) {
    console.error('List staff error:', error)
    return NextResponse.json({ error: 'Failed to load staff' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const forbidden = await requireSuperAdmin(request)
    if (forbidden) return forbidden

    const body = await request.json()
    const parsed = createStaffSchema.safeParse(body)
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

    const { username, password, role } = parsed.data
    const normalizedUsername = username.toLowerCase()

    if (isReservedEnvUsername(normalizedUsername)) {
      return NextResponse.json(
        { error: 'This username is reserved for an env admin account' },
        { status: 409 }
      )
    }

    const existing = await db.adminStaff.findUnique({ where: { username: normalizedUsername } })
    if (existing) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
    }

    const staff = await db.adminStaff.create({
      data: {
        username: normalizedUsername,
        passwordHash: hashPassword(password),
        role,
        active: true,
      },
      select: {
        id: true,
        username: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ success: true, staff }, { status: 201 })
  } catch (error) {
    console.error('Create staff error:', error)
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 })
  }
}
