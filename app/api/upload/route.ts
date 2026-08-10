import { NextRequest, NextResponse } from 'next/server'
import ImageKit from 'imagekit'
import { randomUUID } from 'crypto'
import { requireAdmin } from '@/lib/auth'
import { detectImageType } from '@/lib/file-magic'

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})

export async function POST(request: NextRequest) {
  try {
    const authError = requireAdmin(request)
    if (authError) return authError

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Soft MIME hint only — real check is magic bytes below
    if (file.type && !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const detected = detectImageType(buffer)

    if (!detected.ok) {
      return NextResponse.json({ error: detected.error }, { status: 400 })
    }

    const uniqueFilename = `upload-${randomUUID()}.${detected.ext}`

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: uniqueFilename,
      folder: '/cms-uploads',
      useUniqueFileName: false,
      tags: ['cms', 'vidya-vridhi'],
    })

    return NextResponse.json({
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
      size: uploadResponse.size,
      type: uploadResponse.fileType,
    })
  } catch (error) {
    console.error('ImageKit upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file to ImageKit' }, { status: 500 })
  }
}
