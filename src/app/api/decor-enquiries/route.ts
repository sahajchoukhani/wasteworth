import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { checkRateLimit, isValidEmail, sanitizeText } from '@/lib/rateLimit';
import {
  getBackendMode,
  listDecorEnquiriesWithSignedUrls,
  saveDecorEnquiry,
} from '@/lib/storage';

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json(
      { error: 'Unauthorized. Administrator authentication required.' },
      { status: 401 }
    );
  }
  const enquiries = await listDecorEnquiriesWithSignedUrls();
  return NextResponse.json({
    enquiries,
    backendMode: getBackendMode(),
  });
}

export async function POST(req: NextRequest) {
  const limit = checkRateLimit(req, 'decor-enquiries', 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: `Rate limit reached. Please retry in ${limit.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    const organizationName = sanitizeText(body.organizationName, 160);
    const productType = sanitizeText(body.productType, 120);
    const approximateQuantity = sanitizeText(body.approximateQuantity, 60);
    const contactName = sanitizeText(body.contactName, 120);
    const email = sanitizeText(body.email, 160);
    const phone = sanitizeText(body.phone, 40);

    if (
      !organizationName ||
      !productType ||
      !approximateQuantity ||
      !contactName ||
      !isValidEmail(email) ||
      phone.length < 7
    ) {
      return NextResponse.json(
        { error: 'Please complete all required organization and contact fields.' },
        { status: 400 }
      );
    }

    const saved = await saveDecorEnquiry({
      organizationName,
      productType,
      approximateQuantity,
      logoPath: sanitizeText(body.logoPath, 240) || undefined,
      logoName: sanitizeText(body.logoName, 120) || undefined,
      colourPreferences:
        sanitizeText(body.colourPreferences, 160) || 'Deep Ocean Teal & Brass',
      designPreferences: sanitizeText(body.designPreferences, 500),
      budgetRange: sanitizeText(body.budgetRange, 100) || 'To be discussed',
      specialInstructions: sanitizeText(body.specialInstructions, 500),
      contactName,
      email,
      phone,
      city: sanitizeText(body.city, 80),
    });

    return NextResponse.json(
      {
        success: true,
        referenceNumber: saved.referenceNumber,
        enquiry: saved,
        backendMode: getBackendMode(),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Unable to submit enquiry. Please retry.' },
      { status: 500 }
    );
  }
}
