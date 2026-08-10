import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireSuperAdmin } from '@/lib/auth'
import { hashPassword } from '@/lib/password'

const updateStaffSchema = z.object({
  role: z.enum(['admin', 'content_writer']).optional(),
  active: z.boolean().optional(),
  password: z.string().min(12).max(200).optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const forbidden = await requireSuperAdmin(request)
    if (forbidden) return forbidden

    const { id } = await params
    const body = await request.json()
    const parsed = updateStaffSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const existing = await db.adminStaff.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 })
    }

    const data: {
      role?: string
      active?: boolean
      passwordHash?: string
      sessionVersion?: { increment: number }
    } = {}

    if (parsed.data.role) data.role = parsed.data.role
    if (typeof parsed.data.active === 'boolean') data.active = parsed.data.active
    if (parsed.data.password) data.passwordHash = hashPassword(parsed.data.password)

    // Password change, deactivate, or role change → kill existing cookies
    const shouldBumpSession =
      Boolean(parsed.data.password) ||
      parsed.data.role !== undefined ||
      parsed.data.active === false

    if (shouldBumpSession) {
      data.sessionVersion = { increment: 1 }
    }

    const staff = await db.adminStaff.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ success: true, staff })
  } catch (error) {
    console.error('Update staff error:', error)
    return NextResponse.json({ error: 'Failed to update staff' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const forbidden = await requireSuperAdmin(request)
    if (forbidden) return forbidden

    const { id } = await params
    const existing = await db.adminStaff.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 })
    }

    await db.adminStaff.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete staff error:', error)
    return NextResponse.json({ error: 'Failed to delete staff' }, { status: 500 })
  }
}
