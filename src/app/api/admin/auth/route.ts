import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  getAdminPasscode,
  getExpectedToken,
  isAdminAuthenticated,
} from '@/lib/adminAuth';

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { passcode?: string };
    const passcode = (body.passcode || '').trim();
    if (!passcode || passcode !== getAdminPasscode()) {
      return NextResponse.json(
        { error: 'Invalid studio passcode.' },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ authenticated: true });
    res.cookies.set(ADMIN_COOKIE_NAME, getExpectedToken(), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ authenticated: false });
  res.cookies.delete(ADMIN_COOKIE_NAME);
  return res;
}
