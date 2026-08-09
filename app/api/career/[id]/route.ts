import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = requireAdmin(request)
    if (authError) return authError

    const { id } = await params

    const application = await db.careerApplication.findUnique({
      where: { id },
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    return NextResponse.json({ application })
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
    const authError = requireAdmin(request)
    if (authError) return authError

    const { id } = await params

    await db.careerApplication.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Application deleted successfully' })
  } catch (error) {
    console.error('Error deleting career application:', error)
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 })
  }
}
