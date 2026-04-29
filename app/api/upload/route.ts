import { NextRequest, NextResponse } from 'next/server'
import ImageKit from 'imagekit'
import { randomUUID } from 'crypto'

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})

export async function POST(request: NextRequest) {
  try {
    
    const formData = await request.formData()
    const file = formData.get('file') as File


    if (!file) {
      console.error('No file provided')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const uniqueFilename = `city-${randomUUID()}.${fileExtension}`

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: uniqueFilename,
      folder: '/cities',
      useUniqueFileName: false,
      tags: ['city', 'vidya-vridhi'],
    })


    // Return the ImageKit URL
    return NextResponse.json({ 
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
      size: uploadResponse.size,
      type: uploadResponse.fileType
    })

  } catch (error) {
    console.error('ImageKit upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file to ImageKit' },
      { status: 500 }
    )
  }
}
