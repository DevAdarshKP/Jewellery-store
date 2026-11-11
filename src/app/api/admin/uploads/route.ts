import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/connection';
import { Media } from '@/lib/db/models/Media';
import { storage } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminSession();
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const mimeType = file.type;
    const originalName = file.name || 'image.jpg';
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload via storage port
    const uploadResult = await storage.uploadFile(buffer, originalName, mimeType);

    // Save record to database
    await connectToDatabase();
    const mediaDoc = await Media.create({
      fileKey: uploadResult.fileKey,
      originalName: uploadResult.originalName,
      mimeType: uploadResult.mimeType,
      sizeBytes: uploadResult.sizeBytes,
      url: uploadResult.url,
      uploadedBy: session.userId,
    });

    return NextResponse.json({
      success: true,
      media: {
        id: mediaDoc._id.toString(),
        url: mediaDoc.url,
        fileKey: mediaDoc.fileKey,
        originalName: mediaDoc.originalName,
        sizeBytes: mediaDoc.sizeBytes,
      },
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload media' }, { status: 400 });
  }
}

