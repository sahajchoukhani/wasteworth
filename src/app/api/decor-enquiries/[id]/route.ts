import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { updateDecorEnquiry } from '@/lib/storage';
import { RequestStatus } from '@/types/wasteworth';

const VALID_STATUSES: RequestStatus[] = [
  'New',
  'Under Review',
  'Accepted',
  'Rejected',
  'Completed',
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
    const body = (await req.json()) as {
      status?: RequestStatus;
      internalNotes?: string;
    };

    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = updateDecorEnquiry(id, {
      status: body.status,
      internalNotes: body.internalNotes,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ enquiry: updated });
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
