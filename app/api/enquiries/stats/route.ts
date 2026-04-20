import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get all enquiries counts by status
    const [total, pending, resolved, followUp] = await Promise.all([
      db.enquiry.count(),
      db.enquiry.count({ where: { status: 'PENDING' } }),
      db.enquiry.count({ where: { status: 'RESOLVED' } }),
      db.enquiry.count({ where: { status: 'FOLLOW_UP' } })
    ])

    return NextResponse.json({
      total,
      pending,
      resolved,
      followUp
    })
  } catch (error) {
    console.error('Error fetching enquiry stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch enquiry statistics' },
      { status: 500 }
    )
  }
}
