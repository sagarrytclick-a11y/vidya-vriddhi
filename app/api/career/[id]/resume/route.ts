import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireCanViewLeads } from '@/lib/auth'
import { getImageKit } from '@/lib/imagekit'

/**
 * Auth-only resume download. New uploads are ImageKit private files + short-lived signed URL.
 * Legacy public URLs are streamed through this route so the CDN link is not exposed in the UI.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireCanViewLeads(request)
    if (authError) return authError

    const { id } = await params
    const application = await db.careerApplication.findUnique({ where: { id } })
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const stored = application.resumeUrl

    // Legacy public absolute URL — stream so UI never needs the raw CDN link
    if (stored.startsWith('http://') || stored.startsWith('https://')) {
      const upstream = await fetch(stored)
      if (!upstream.ok || !upstream.body) {
        return NextResponse.json({ error: 'Resume unavailable' }, { status: 502 })
      }
      return new NextResponse(upstream.body, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="resume-${id}.pdf"`,
          'Cache-Control': 'private, no-store',
        },
      })
    }

    // Private ImageKit path
    const signedUrl = getImageKit().url({
      path: stored.startsWith('/') ? stored : `/${stored}`,
      signed: true,
      expireSeconds: 120,
    })

    return NextResponse.redirect(signedUrl)
  } catch (error) {
    console.error('Resume proxy error:', error)
    return NextResponse.json({ error: 'Failed to load resume' }, { status: 500 })
  }
}
