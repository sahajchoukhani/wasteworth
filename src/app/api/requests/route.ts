import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { checkRateLimit, isValidEmail, sanitizeText } from '@/lib/rateLimit';
import {
  getBackendMode,
  listCustomRequestsWithSignedUrls,
  saveCustomRequest,
} from '@/lib/storage';

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json(
      { error: 'Unauthorized. Administrator authentication required.' },
      { status: 401 }
    );
  }
  const requests = await listCustomRequestsWithSignedUrls();
  return NextResponse.json({
    requests,
    backendMode: getBackendMode(),
  });
}

export async function POST(req: NextRequest) {
  const limit = checkRateLimit(req, 'requests', 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: `Rate limit reached. Please retry in ${limit.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    const materials = Array.isArray(body.materials)
      ? body.materials.map((m: unknown) => sanitizeText(m, 80)).filter(Boolean)
      : [];
    const customMaterial = sanitizeText(body.customMaterial, 200);
    const productType = sanitizeText(body.productType, 80);

    const fullName = sanitizeText(body.customer?.fullName, 120);
    const email = sanitizeText(body.customer?.email, 160);
    const phone = sanitizeText(body.customer?.phone, 40);
    const city = sanitizeText(body.customer?.city, 80);
    const deliveryAddress = sanitizeText(body.customer?.deliveryAddress, 300);
    const preferredContact =
      body.customer?.preferredContact === 'Email' ||
      body.customer?.preferredContact === 'Phone'
        ? body.customer.preferredContact
        : 'WhatsApp';

    if (materials.length === 0 && !customMaterial) {
      return NextResponse.json(
        { error: 'Please select or specify at least one material.' },
        { status: 400 }
      );
    }
    if (!productType) {
      return NextResponse.json(
        { error: 'Please select a desired product category.' },
        { status: 400 }
      );
    }
    if (!fullName || !isValidEmail(email) || phone.length < 7 || !city) {
      return NextResponse.json(
        { error: 'Please provide valid name, email, phone, and city.' },
        { status: 400 }
      );
    }

    const uploadedImagePaths = Array.isArray(body.uploadedImagePaths)
      ? body.uploadedImagePaths
          .map((p: unknown) => sanitizeText(p, 240))
          .filter(Boolean)
          .slice(0, 6)
      : [];

    const saved = await saveCustomRequest({
      materials,
      customMaterial,
      productType,
      customization: {
        colourPreference:
          sanitizeText(body.customization?.colourPreference, 80) ||
          'Deep Ocean Teal',
        colourHex: sanitizeText(body.customization?.colourHex, 20) || '#0E4456',
        designStyle:
          sanitizeText(body.customization?.designStyle, 80) || 'Marbled Atelier',
        pattern:
          sanitizeText(body.customization?.pattern, 80) || 'Organic Vein',
        size: sanitizeText(body.customization?.size, 60) || 'Standard',
        personalText: sanitizeText(body.customization?.personalText, 60),
        logoPath: sanitizeText(body.customization?.logoPath, 240) || undefined,
        logoName: sanitizeText(body.customization?.logoName, 120) || undefined,
        specialInstructions: sanitizeText(
          body.customization?.specialInstructions,
          600
        ),
      },
      uploadedImagePaths,
      uploadedImages: Array.isArray(body.uploadedImages)
        ? body.uploadedImages.slice(0, 6)
        : [],
      customer: {
        fullName,
        email,
        phone,
        city,
        deliveryAddress,
        preferredContact,
      },
    });

    return NextResponse.json(
      {
        success: true,
        referenceNumber: saved.referenceNumber,
        request: saved,
        backendMode: getBackendMode(),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Unable to save your customization request. Please retry.' },
      { status: 500 }
    );
  }
}
