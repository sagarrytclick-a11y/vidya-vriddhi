import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authError = requireAdmin(request)
    if (authError) return authError

    const stats = await db.$queryRaw<{ status: string; count: bigint }[]>`
      SELECT status, COUNT(*)::int as count FROM "Enquiry" GROUP BY status
    `

    const result = { total: 0, pending: 0, resolved: 0, followUp: 0 }
    for (const row of stats) {
      const key = row.status === 'FOLLOW_UP' ? 'followUp' : row.status.toLowerCase() as keyof typeof result
      result[key] = Number(row.count)
      result.total += Number(row.count)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching enquiry stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch enquiry statistics' },
      { status: 500 }
    )
  }
}
