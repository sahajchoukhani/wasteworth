import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { sanitizeText } from '@/lib/rateLimit';
import { updateProduct } from '@/lib/storage';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await req.json();

    const updated = await updateProduct(id, {
      ...(body.name !== undefined ? { name: sanitizeText(body.name, 120) } : {}),
      ...(body.shortDescription !== undefined
        ? { shortDescription: sanitizeText(body.shortDescription, 400) }
        : {}),
      ...(body.materialUsed !== undefined
        ? { materialUsed: sanitizeText(body.materialUsed, 200) }
        : {}),
      ...(body.indicativePrice !== undefined
        ? { indicativePrice: sanitizeText(body.indicativePrice, 80) }
        : {}),
      ...(body.image !== undefined
        ? { image: sanitizeText(body.image, 400) }
        : {}),
      ...(typeof body.isActive === 'boolean' ? { isActive: body.isActive } : {}),
    });

    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product: updated });
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
