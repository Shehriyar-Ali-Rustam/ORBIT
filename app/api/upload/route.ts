import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const path = formData.get('path') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!path) {
      return NextResponse.json({ error: 'No path provided' }, { status: 400 })
    }

    // File uploads are handled client-side via Firebase Storage SDK
    // This route exists as a fallback/proxy if needed
    return NextResponse.json({
      message: 'Use client-side Firebase Storage SDK for uploads',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
