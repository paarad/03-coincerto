import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string[] }> }
) {
  try {
    const { filename } = await params;
    const filenameStr = filename.join('/');
    const mediaDir = path.join(process.cwd(), 'data', 'tracks', 'media');
    const filePath = path.join(mediaDir, filenameStr);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return new NextResponse('Image not found', { status: 404 });
    }
    
    // Read and serve the image
    const imageBuffer = await fs.readFile(filePath);
    
    // Determine content type based on file extension
    const ext = path.extname(filenameStr).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' :
                       ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                       ext === '.webp' ? 'image/webp' :
                       'application/octet-stream';
    
    return new NextResponse(imageBuffer as any, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error serving media file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 