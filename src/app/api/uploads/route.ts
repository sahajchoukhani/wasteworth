import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { uploadPrivateFile } from '@/lib/storage';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const limit = checkRateLimit(req, 'uploads', 25, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: `Too many uploads. Retry in ${limit.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const folderRaw = formData.get('folder');
    const folder = folderRaw === 'logos' ? 'logos' : 'materials';

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Only JPG, PNG, and WEBP images are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: 'File exceeds the 4 MB limit.' },
        { status: 400 }
      );
    }

    const arrayBuf = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);
    const { storagePath } = await uploadPrivateFile(
      buffer,
      file.name,
      file.type,
      folder
    );

    return NextResponse.json(
      {
        success: true,
        storagePath,
        name: file.name,
        size: file.size,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to store uploaded image.' },
      { status: 500 }
    );
  }
}
