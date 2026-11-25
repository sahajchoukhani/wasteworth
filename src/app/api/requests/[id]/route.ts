import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { sanitizeText } from '@/lib/rateLimit';
import { updateCustomRequest } from '@/lib/storage';
import { RequestStatus } from '@/types/wasteworth';

const VALID_STATUSES: RequestStatus[] = [
  'NEW',
  'UNDER_REVIEW',
  'ACCEPTED',
  'REJECTED',
  'IN_PRODUCTION',
  'COMPLETED',
];

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

    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await updateCustomRequest(id, {
      status: body.status,
      adminNotes:
        typeof body.adminNotes === 'string'
          ? sanitizeText(body.adminNotes, 1000)
          : undefined,
      estimatedPrice:
        body.estimatedPrice === null || body.estimatedPrice === ''
          ? null
          : typeof body.estimatedPrice === 'number' ||
            typeof body.estimatedPrice === 'string'
          ? Number(body.estimatedPrice)
          : undefined,
      finalQuotedPrice:
        body.finalQuotedPrice === null || body.finalQuotedPrice === ''
          ? null
          : typeof body.finalQuotedPrice === 'number' ||
            typeof body.finalQuotedPrice === 'string'
          ? Number(body.finalQuotedPrice)
          : undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ request: updated });
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
