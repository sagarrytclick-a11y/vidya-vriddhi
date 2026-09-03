import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireCanViewLeads, requireCanDelete } from '@/lib/auth'
import { getImageKit } from '@/lib/imagekit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireCanViewLeads(request)
    if (authError) return authError

    const { id } = await params

    const application = await db.careerApplication.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        position: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    return NextResponse.json({
      application: {
        ...application,
        resumeUrl: `/api/career/${application.id}/resume`,
      },
    })
  } catch (error) {
    console.error('Error fetching career application:', error)
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireCanDelete(request)
    if (authError) return authError

    const { id } = await params

    const existing = await db.careerApplication.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    if (existing.resumeFileId) {
      try {
        await getImageKit().deleteFile(existing.resumeFileId)
      } catch (error) {
        console.error('ImageKit resume delete failed:', error)
      }
    }

    await db.careerApplication.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Application deleted successfully' })
  } catch (error) {
    console.error('Error deleting career application:', error)
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 })
  }
}
