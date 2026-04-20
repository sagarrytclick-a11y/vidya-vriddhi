import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// Validation schema for status update
const statusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'RESOLVED', 'FOLLOW_UP'])
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate the request body
    const validatedData = statusUpdateSchema.parse(body)
    
    // Update the enquiry
    const enquiry = await db.enquiry.update({
      where: { id },
      data: {
        status: validatedData.status,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Enquiry status updated successfully',
      data: enquiry
    })

  } catch (error) {
    console.error('Error updating enquiry:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.issues
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update enquiry'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Delete the enquiry
    await db.enquiry.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Enquiry deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting enquiry:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete enquiry'
    }, { status: 500 })
  }
}
