import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireCanViewLeads, requireCanDelete } from '@/lib/auth'

const statusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'RESOLVED', 'FOLLOW_UP']),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireCanViewLeads(request)
    if (authError) return authError

    const { id } = await params
    const body = await request.json()
    const validatedData = statusUpdateSchema.parse(body)

    const lead = await db.serviceEnquiry.update({
      where: { id },
      data: { status: validatedData.status },
    })

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully',
      data: lead,
    })
  } catch (error) {
    console.error('Error updating service enquiry:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update service enquiry' },
      { status: 500 }
    )
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
    await db.serviceEnquiry.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'Service enquiry deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting service enquiry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete service enquiry' },
      { status: 500 }
    )
  }
}
